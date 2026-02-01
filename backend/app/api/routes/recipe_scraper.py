import logging

import httpx
from fastapi import APIRouter, HTTPException
from recipe_scrapers import scrape_html

from app.models import ParseRecipeResponse

logger = logging.getLogger(__name__)
router = APIRouter(tags=["recipe_scraper"], prefix="/recipe_scraper")


@router.post("/parse_recipe/", response_model=ParseRecipeResponse)
async def parse_recipe(url: str) -> ParseRecipeResponse:
    """
    Asynchronously parse recipe data from HTML content.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, follow_redirects=True)
            logger.debug(
                f"URL: {url}, Status: {response.status_code}, Headers: {dict(response.headers)}"
            )

            response.raise_for_status()
            html_content = response.text
        except httpx.HTTPStatusError as e:
            logger.error(
                f"HTTP Error for {url}: {e.response.status_code}, Headers: {dict(e.response.headers)}"
            )
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Failed to fetch URL: {e.response.status_code}",
            )
        except httpx.RequestError as e:
            logger.error(f"Request Error for {url}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")

    scraper = scrape_html(html_content, url)
    return scraper.to_json()
