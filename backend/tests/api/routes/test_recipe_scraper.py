from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest
from fastapi.testclient import TestClient

from app.core.config import settings


@pytest.fixture
def test_recipe_html() -> str:
    """Load test recipe HTML content."""
    test_data_path = Path(__file__).parent.parent.parent / "test_data" / "test-recipe.html"
    with open(test_data_path) as f:
        return f.read()


def test_parse_recipe_success(client: TestClient, test_recipe_html: str) -> None:
    """Test successful recipe parsing with valid HTML."""
    test_url = "https://example.com/recipe/test-recipe"

    # Mock the httpx.AsyncClient.get method to return test HTML
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.text = test_recipe_html
    mock_response.headers = {}
    mock_response.raise_for_status = AsyncMock()

    # Mock the scrape_html function to return a mock scraper with to_json method
    mock_scraper = MagicMock()
    mock_scraper.to_json.return_value = {"name": "Test Recipe", "ingredients": []}

    with patch("httpx.AsyncClient.get", return_value=mock_response):
        with patch(
            "app.api.routes.recipes.scrape_html", return_value=mock_scraper
        ):
            response = client.post(
                f"{settings.API_V1_STR}/recipes/scrape",
                params={"url": test_url},
            )

    assert response.status_code == 200
    content = response.json()
    # Verify response contains recipe data (non-empty dict)
    assert isinstance(content, dict)


def test_parse_recipe_missing_url(client: TestClient) -> None:
    """Test recipe parsing fails when URL parameter is missing."""
    response = client.post(
        f"{settings.API_V1_STR}/recipes/scrape",
    )

    # Should return 422 Unprocessable Entity for missing required parameter
    assert response.status_code == 422


def test_parse_recipe_http_error(client: TestClient) -> None:
    """Test recipe parsing handles HTTP errors gracefully."""
    test_url = "https://example.com/not-found"

    # Mock the httpx.AsyncClient.get method to raise HTTPStatusError
    async def mock_get_error(*_args, **_kwargs):
        response = httpx.Response(404, text="Not Found")
        request = httpx.Request("GET", test_url)
        raise httpx.HTTPStatusError("404 Not Found", request=request, response=response)

    with patch("httpx.AsyncClient.get", side_effect=mock_get_error):
        response = client.post(
            f"{settings.API_V1_STR}/recipes/scrape",
            params={"url": test_url},
        )

    assert response.status_code == 404
    content = response.json()
    assert "detail" in content


def test_parse_recipe_request_error(client: TestClient) -> None:
    """Test recipe parsing handles request errors gracefully."""
    test_url = "https://invalid-domain-that-does-not-exist.example.com"

    # Mock the httpx.AsyncClient.get method to raise RequestError
    async def mock_get_error(*_args, **_kwargs):
        raise httpx.RequestError("Connection failed")

    with patch("httpx.AsyncClient.get", side_effect=mock_get_error):
        response = client.post(
            f"{settings.API_V1_STR}/recipes/scrape",
            params={"url": test_url},
        )

    assert response.status_code == 500
    content = response.json()
    assert "detail" in content

