import httpx
from fastapi import APIRouter, HTTPException

from app.lib.recipe_scraper import scrape_recipe_from_url
from app.models import ParseRecipeResponse

router = APIRouter(tags=["recipe_scraper"], prefix="/recipe_scraper")


@router.post("/parse_recipe/", response_model=ParseRecipeResponse)
async def parse_recipe(url: str) -> ParseRecipeResponse:
    """
    Asynchronously parse recipe data from a URL.
    """
    try:
        recipe_data = await scrape_recipe_from_url(url=url)
        return ParseRecipeResponse(**recipe_data)
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Failed to fetch URL: {e.response.status_code}",
        )
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")
