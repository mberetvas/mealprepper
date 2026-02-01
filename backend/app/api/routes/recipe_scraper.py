import httpx
from fastapi import APIRouter, HTTPException

from app.api.deps import CurrentUser, SessionDep
from app.lib.recipe_scraper import scrape_recipe_from_url
from app.models import ParseRecipeResponse, Recipe

router = APIRouter(tags=["recipe_scraper"], prefix="/recipe_scraper")


@router.post("/parse_recipe/", response_model=ParseRecipeResponse)
async def parse_recipe(
    url: str,
    session: SessionDep,
    current_user: CurrentUser,
    save: bool = False,
) -> ParseRecipeResponse:
    """
    Asynchronously parse recipe data from a URL.
    If save is True, the recipe is saved to the database for the current user.
    """
    try:
        recipe_data = await scrape_recipe_from_url(url=url)
        response = ParseRecipeResponse(**recipe_data)

        if save:
            # Convert IngredientGroup objects to dicts for JSON storage
            ingredient_groups_list = None
            if response.ingredient_groups:
                ingredient_groups_list = [
                    g.model_dump() for g in response.ingredient_groups
                ]

            recipe = Recipe(
                owner_id=current_user.id,
                title=response.title or "Untitled",
                url=url,
                image=response.image,
                site_name=response.site_name,
                ingredients=response.ingredients,
                ingredient_groups=ingredient_groups_list,
                instructions=response.instruction_list,
                nutrients=response.nutrients,
            )
            session.add(recipe)
            session.commit()

        return response
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Failed to fetch URL: {e.response.status_code}",
        )
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")