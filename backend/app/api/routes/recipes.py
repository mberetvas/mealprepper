"""Recipe API endpoints for CRUD operations and web scraping."""

import uuid
from typing import Any

import httpx
from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app import crud
from app.api.deps import CurrentUser, SessionDep
from app.lib.recipe_scraper import scrape_recipe_from_url
from app.models import (
    Message,
    ParseRecipeResponse,
    Recipe,
    RecipeCreate,
    RecipePublic,
    RecipesPublic,
    RecipeUpdate,
)

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("/", response_model=RecipesPublic)
def read_recipes(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    """
    Retrieve recipes for the current user.

    Superusers can see all recipes, regular users see only their own.
    """
    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Recipe)
        count = session.exec(count_statement).one()
        statement = (
            select(Recipe).order_by(Recipe.created_at.desc()).offset(skip).limit(limit)  # type: ignore
        )
        recipes = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(Recipe)
            .where(Recipe.owner_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Recipe)
            .where(Recipe.owner_id == current_user.id)
            .order_by(Recipe.created_at.desc())  # type: ignore
            .offset(skip)
            .limit(limit)
        )
        recipes = session.exec(statement).all()

    return RecipesPublic(data=recipes, count=count)


@router.get("/{id}", response_model=RecipePublic)
def read_recipe(session: SessionDep, current_user: CurrentUser, id: uuid.UUID) -> Any:
    """
    Get recipe by ID.

    Users can only access their own recipes unless they are superusers.
    """
    recipe = session.get(Recipe, id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if not current_user.is_superuser and (recipe.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return recipe


@router.post("/", response_model=RecipePublic)
def create_recipe(
    *, session: SessionDep, current_user: CurrentUser, recipe_in: RecipeCreate
) -> Any:
    """
    Create new recipe manually.

    Use this endpoint to create a recipe from scratch.
    For scraping recipes from URLs, use the /recipes/scrape endpoint.
    """
    recipe = crud.create_recipe(
        session=session, recipe_in=recipe_in, owner_id=current_user.id
    )
    return recipe


@router.put("/{id}", response_model=RecipePublic)
def update_recipe(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
    recipe_in: RecipeUpdate,
) -> Any:
    """
    Update a recipe.

    Users can only update their own recipes unless they are superusers.
    """
    recipe = session.get(Recipe, id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if not current_user.is_superuser and (recipe.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    recipe = crud.update_recipe(session=session, db_recipe=recipe, recipe_in=recipe_in)
    return recipe


@router.delete("/{id}")
def delete_recipe(
    session: SessionDep, current_user: CurrentUser, id: uuid.UUID
) -> Message:
    """
    Delete a recipe.

    Users can only delete their own recipes unless they are superusers.
    """
    recipe = session.get(Recipe, id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    if not current_user.is_superuser and (recipe.owner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    session.delete(recipe)
    session.commit()
    return Message(message="Recipe deleted successfully")


@router.post("/scrape", response_model=ParseRecipeResponse)
async def scrape_recipe(
    url: str,
    session: SessionDep,
    current_user: CurrentUser,
    save: bool = False,
) -> ParseRecipeResponse:
    """
    Scrape recipe data from a URL.

    Asynchronously parses recipe data from a web page.
    If save=true, the recipe is automatically saved to the database.

    Args:
        url: URL of the recipe to scrape
        save: Whether to save the scraped recipe to database
        session: Database session (injected)
        current_user: Current authenticated user (injected)

    Returns:
        Parsed recipe data

    Raises:
        HTTPException: If the URL cannot be fetched or parsed
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

            # Create RecipeCreate schema from ParseRecipeResponse
            recipe_create = RecipeCreate(
                title=response.title or "Untitled Recipe",
                url=url,
                image=response.image,
                site_name=response.site_name,
                ingredients=response.ingredients,
                ingredient_groups=ingredient_groups_list,
                instructions=response.instruction_list or [],
                nutrients=response.nutrients,
            )

            crud.create_recipe(
                session=session, recipe_in=recipe_create, owner_id=current_user.id
            )

        return response

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Failed to fetch URL: {e.response.status_code}",
        )
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")

