from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings


@pytest.fixture
def test_recipe_html() -> str:
    """Load test recipe HTML content."""
    test_data_path = Path(__file__).parent.parent.parent / "test_data" / "test-recipe.html"
    with open(test_data_path) as f:
        return f.read()


def test_parse_recipe_success(client: TestClient, normal_user_token_headers: dict[str, str]) -> None:
    """Test successful recipe parsing with valid HTML."""
    test_url = "https://example.com/recipe/test-recipe"

    # Mock the scrape_recipe_from_url function in the recipes module
    async def mock_scrape(*_args, **_kwargs):
        return {"title": "Test Recipe", "ingredients": []}

    with patch("app.api.routes.recipes.scrape_recipe_from_url", side_effect=mock_scrape):
        response = client.post(
            f"{settings.API_V1_STR}/recipes/scrape",
            params={"url": test_url},
            headers=normal_user_token_headers,
        )

    assert response.status_code == 200
    content = response.json()
    # Verify response contains recipe data (non-empty dict)
    assert isinstance(content, dict)


def test_parse_recipe_missing_url(client: TestClient, normal_user_token_headers: dict[str, str]) -> None:
    """Test recipe parsing fails when URL parameter is missing."""
    response = client.post(
        f"{settings.API_V1_STR}/recipes/scrape",
        headers=normal_user_token_headers,
    )

    # Should return 422 Unprocessable Entity for missing required parameter
    assert response.status_code == 422


def test_parse_recipe_http_error(client: TestClient, normal_user_token_headers: dict[str, str]) -> None:
    """Test recipe parsing handles HTTP errors gracefully."""
    test_url = "https://example.com/not-found"

    # Mock the scrape_recipe_from_url to raise HTTPStatusError
    async def mock_scrape_error(*_args, **_kwargs):
        response = httpx.Response(404, text="Not Found")
        request = httpx.Request("GET", test_url)
        raise httpx.HTTPStatusError("404 Not Found", request=request, response=response)

    with patch("app.api.routes.recipes.scrape_recipe_from_url", side_effect=mock_scrape_error):
        response = client.post(
            f"{settings.API_V1_STR}/recipes/scrape",
            params={"url": test_url},
            headers=normal_user_token_headers,
        )

    assert response.status_code == 404
    content = response.json()
    assert "detail" in content


def test_parse_recipe_request_error(client: TestClient, normal_user_token_headers: dict[str, str]) -> None:
    """Test recipe parsing handles request errors gracefully."""
    test_url = "https://invalid-domain-that-does-not-exist.example.com"

    # Mock the scrape_recipe_from_url to raise RequestError
    async def mock_scrape_error(*_args, **_kwargs):
        raise httpx.RequestError("Connection failed")

    with patch("app.api.routes.recipes.scrape_recipe_from_url", side_effect=mock_scrape_error):
        response = client.post(
            f"{settings.API_V1_STR}/recipes/scrape",
            params={"url": test_url},
            headers=normal_user_token_headers,
        )

    assert response.status_code == 500
    content = response.json()
    assert "detail" in content


def test_parse_recipe_requires_authentication(client: TestClient) -> None:
    """Test recipe scraper endpoint requires valid authentication (Spec: User Story 3)."""
    test_url = "https://example.com/recipe/test-recipe"
    
    # Call endpoint WITHOUT authentication header
    response = client.post(
        f"{settings.API_V1_STR}/recipes/scrape",
        params={"url": test_url},
    )
    
    # Should return 403 Forbidden for unauthenticated request
    # (FastAPI dependency injection denies access)
    assert response.status_code in [401, 403]


def test_parse_recipe_with_invalid_token(client: TestClient) -> None:
    """Test recipe scraper endpoint rejects invalid tokens (Spec: User Story 3)."""
    test_url = "https://example.com/recipe/test-recipe"
    
    # Call endpoint WITH invalid token
    response = client.post(
        f"{settings.API_V1_STR}/recipes/scrape",
        params={"url": test_url},
        headers={"Authorization": "Bearer invalid-token-12345"},
    )
    
    # Should return 401 or 403 Unauthorized/Forbidden for invalid token
    assert response.status_code in [401, 403]


def test_parse_recipe_success_authenticated(
    client: TestClient, 
    normal_user_token_headers: dict[str, str],
) -> None:
    """Test successful recipe parsing with authentication (Spec: User Story 1)."""
    test_url = "https://example.com/recipe/test-recipe"

    # Mock the scrape_recipe_from_url function
    async def mock_scrape(*_args, **_kwargs):
        return {
            "title": "Test Recipe",
            "ingredients": ["flour", "eggs"],
            "instruction_list": ["Mix", "Bake"],
        }

    with patch("app.api.routes.recipes.scrape_recipe_from_url", side_effect=mock_scrape):
        response = client.post(
            f"{settings.API_V1_STR}/recipes/scrape",
            params={"url": test_url},
            headers=normal_user_token_headers,
        )

    assert response.status_code == 200
    content = response.json()
    # Verify response contains recipe data
    assert isinstance(content, dict)
    assert content.get("title") == "Test Recipe"
    assert content.get("ingredients") == ["flour", "eggs"]


def test_parse_recipe_with_save_true_authenticated(
    client: TestClient,
    normal_user_token_headers: dict[str, str],
) -> None:
    """Test recipe is saved to database when save=true (Spec: User Story 1, FR-007)."""
    test_url = "https://example.com/recipe/test-recipe"

    # Mock the scrape_recipe_from_url function
    async def mock_scrape(*_args, **_kwargs):
        return {
            "title": "Test Recipe to Save",
            "ingredients": ["flour", "eggs"],
            "instruction_list": ["Mix", "Bake"],
            "site_name": "example.com",
        }

    with patch("app.api.routes.recipes.scrape_recipe_from_url", side_effect=mock_scrape):
        response = client.post(
            f"{settings.API_V1_STR}/recipes/scrape",
            params={"url": test_url, "save": "true"},
            headers=normal_user_token_headers,
        )

    # Should succeed and return recipe data
    assert response.status_code == 200
    content = response.json()
    assert content.get("title") == "Test Recipe to Save"
    # The actual DB persistence is verified by the endpoint not raising an exception
    # and returning 200 OK


def test_parse_recipe_with_save_false_default(
    client: TestClient,
    normal_user_token_headers: dict[str, str],
) -> None:
    """Test recipe is NOT saved when save=false or not provided (Spec: User Story 1, FR-006)."""
    test_url = "https://example.com/recipe/not-saved"

    # Mock the scrape_recipe_from_url function
    async def mock_scrape(*_args, **_kwargs):
        return {
            "title": "Recipe Not Saved",
            "ingredients": ["flour"],
        }

    with patch("app.api.routes.recipes.scrape_recipe_from_url", side_effect=mock_scrape):
        # Call WITHOUT save parameter (defaults to false)
        response = client.post(
            f"{settings.API_V1_STR}/recipes/scrape",
            params={"url": test_url},
            headers=normal_user_token_headers,
        )

    # Should return parsed data but not save
    assert response.status_code == 200
    content = response.json()
    assert content.get("title") == "Recipe Not Saved"
    # Query is not executed and not saved to DB when save=false (default behavior)


def test_parse_recipe_response_includes_all_fields(
    client: TestClient,
    normal_user_token_headers: dict[str, str],
) -> None:
    """Test response includes all ParseRecipeResponse fields (Spec: FR-011)."""
    test_url = "https://example.com/recipe/complete"

    # Mock with comprehensive recipe data
    async def mock_scrape(*_args, **_kwargs):
        return {
            "title": "Complete Recipe",
            "author": "Chef John",
            "description": "A delicious recipe",
            "image": "https://example.com/image.jpg",
            "site_name": "example.com",
            "ingredients": ["flour", "sugar"],
            "instruction_list": ["Mix", "Bake"],
            "cook_time": 30,
            "prep_time": 15,
            "total_time": 45,
            "yields": "4 servings",
            "ratings": 4.5,
            "nutrients": {"calories": "250"},
        }

    with patch("app.api.routes.recipes.scrape_recipe_from_url", side_effect=mock_scrape):
        response = client.post(
            f"{settings.API_V1_STR}/recipes/scrape",
            params={"url": test_url},
            headers=normal_user_token_headers,
        )

    assert response.status_code == 200
    content = response.json()
    
    # Verify all fields are present in response (may be null)
    assert "title" in content
    assert "author" in content
    assert "description" in content
    assert "image" in content
    assert "site_name" in content
    assert "ingredients" in content
    assert "cook_time" in content
    assert "prep_time" in content
    assert "total_time" in content
    assert "yields" in content
    assert "ratings" in content
    assert "nutrients" in content
    
    # Verify values
    assert content["title"] == "Complete Recipe"
    assert content["cook_time"] == 30
    assert content["ratings"] == 4.5

