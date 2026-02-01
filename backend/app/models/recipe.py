"""
Recipe models for database tables and request/response schemas.

Database Tables:
    - Recipe: Recipe storage with scraped/manual data

Request Schemas:
    - RecipeCreate: Create a new recipe
    - RecipeUpdate: Update an existing recipe

Response Schemas:
    - RecipePublic: Public recipe information
    - RecipesPublic: Paginated list of recipes
    - ParseRecipeResponse: Response from recipe scraper
    - IngredientGroup: Grouped ingredients with purpose
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import JSON, DateTime
from sqlmodel import Field, Relationship, SQLModel

from app.models.base import get_datetime_utc

if TYPE_CHECKING:
    from app.models.user import User


class IngredientGroup(SQLModel):
    """
    Group of ingredients with a purpose/label.
    
    Used for recipes that have separate ingredient sections
    (e.g., "For the dough", "For the filling").
    """
    
    purpose: str | None = None
    ingredients: list[str] = Field(default_factory=list)


# Shared properties
class RecipeBase(SQLModel):
    """
    Base recipe properties shared across create/update schemas.
    
    Contains common fields for recipe management.
    """
    
    title: str = Field(min_length=1, max_length=255)
    url: str | None = Field(default=None, max_length=2048)
    image: str | None = Field(default=None, max_length=2048)
    site_name: str | None = Field(default=None, max_length=255)
    ingredients: list[str] | None = None
    ingredient_groups: list[dict[str, Any]] | None = None
    instructions: list[str] | None = None
    nutrients: dict[str, str] | None = None


# Properties to receive on recipe creation
class RecipeCreate(RecipeBase):
    """
    Schema for creating a new recipe via API.
    
    Can be used for manual recipe entry or when saving scraped recipes.
    Owner is set automatically from authenticated user.
    Used by POST /recipes/ endpoint.
    """
    
    pass


# Properties to receive on recipe update
class RecipeUpdate(SQLModel):
    """
    Schema for updating an existing recipe via API.
    
    All fields are optional to support partial updates.
    Used by PUT /recipes/{id} endpoint.
    """
    
    title: str | None = Field(default=None, min_length=1, max_length=255)
    url: str | None = Field(default=None, max_length=2048)
    image: str | None = Field(default=None, max_length=2048)
    site_name: str | None = Field(default=None, max_length=255)
    ingredients: list[str] | None = None
    ingredient_groups: list[dict[str, Any]] | None = None
    instructions: list[str] | None = None
    nutrients: dict[str, str] | None = None


# Database model, database table inferred from class name
class Recipe(RecipeBase, table=True):
    """
    Recipe database table model.
    
    Stores recipe data from web scraping or manual entry.
    JSON fields allow flexible storage of structured recipe data.
    
    Relationships:
        - owner: Many-to-one relationship with User
    
    Foreign Keys:
        - owner_id: References user.id (CASCADE on delete)
    
    Table name: recipe
    """
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: "User | None" = Relationship(back_populates="recipes")  # type: ignore
    
    # Override base fields to add JSON storage type
    ingredients: list[str] | None = Field(default=None, sa_type=JSON)
    ingredient_groups: list[dict[str, Any]] | None = Field(default=None, sa_type=JSON)
    instructions: list[str] | None = Field(default=None, sa_type=JSON)
    nutrients: dict[str, str] | None = Field(default=None, sa_type=JSON)
    
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )


# Properties to return via API, id is always required
class RecipePublic(RecipeBase):
    """
    Public recipe information returned by API endpoints.
    
    Includes recipe ID and owner ID for access control.
    Used in all recipe-related API responses.
    """
    
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime | None = None


class RecipesPublic(SQLModel):
    """
    Paginated list of recipes for API responses.
    
    Used by GET /recipes/ endpoint with skip/limit pagination.
    """
    
    data: list[RecipePublic]
    count: int


# Recipe scraper response model
class ParseRecipeResponse(SQLModel):
    """
    Response model for the recipe scraper/parser endpoint.
    
    Contains all possible fields from recipe_scrapers library.
    Not all fields are persisted to database when saving.
    Used by POST /recipes/scrape endpoint.
    """
    
    # Core recipe information
    title: str | None = None
    author: str | None = None
    description: str | None = None
    image: str | None = None
    site_name: str | None = None
    host: str | None = None
    canonical_url: str | None = None
    language: str | None = None

    # Ingredients
    ingredients: list[str] | None = None
    ingredient_groups: list[IngredientGroup] | None = None

    # Instructions
    instructions: str | None = None
    instruction_list: list[str] | None = None

    # Timing information
    prep_time: int | None = None  # in minutes
    cook_time: int | None = None  # in minutes
    total_time: int | None = None  # in minutes

    # Servings/yields
    yields: str | None = None

    # Ratings and reviews
    ratings: float | None = None
    ratings_count: float | None = None

    # Categories and cuisine
    category: str | None = None
    cuisine: str | None = None
    cooking_method: str | None = None

    # Dietary and nutritional information
    dietary_restrictions: list[str] | None = None
    nutrients: dict[str, str] | None = None

    # Equipment needed
    equipment: list[str] | None = None

    # Additional metadata
    keywords: list[str] | None = None
    links: list[dict[str, str]] | None = None

