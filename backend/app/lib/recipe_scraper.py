import logging
from typing import Any

import httpx
from recipe_scrapers import scrape_html

logger = logging.getLogger(__name__)


async def scrape_recipe_from_url(url: str) -> dict[str, Any]:
    """
    Asynchronously fetch and parse recipe data from a URL.

    Args:
        url: The URL of the recipe to scrape.

    Returns:
        A dictionary containing the parsed recipe data.

    Raises:
        httpx.HTTPStatusError: If the HTTP request fails.
        httpx.RequestError: If the request encounters an error.
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
            raise
        except httpx.RequestError as e:
            logger.error(f"Request Error for {url}: {str(e)}")
            raise

    scraper = scrape_html(html_content, url)
    return scraper.to_json()
