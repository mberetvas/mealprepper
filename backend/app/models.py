import uuid
from datetime import datetime, timezone
from typing import Any

from pydantic import EmailStr
from sqlalchemy import JSON, DateTime
from sqlmodel import Field, Relationship, SQLModel


def get_datetime_utc() -> datetime:
    return datetime.now(timezone.utc)


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    recipes: list["Recipe"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID
    created_at: datetime | None = None


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime | None = None


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Recipe Model
class Recipe(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="recipes")

    title: str = Field(max_length=255)
    url: str = Field(max_length=2048)
    image: str | None = Field(default=None, max_length=2048)
    site_name: str | None = Field(default=None, max_length=255)

    # JSON content for flexible storage of recipe details
    ingredients: list[str] | None = Field(default=None, sa_type=JSON)
    ingredient_groups: list[dict[str, Any]] | None = Field(default=None, sa_type=JSON)
    instructions: list[str] | None = Field(default=None, sa_type=JSON)
    nutrients: dict[str, str] | None = Field(default=None, sa_type=JSON)

    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


# Recipe scraper models
class IngredientGroup(SQLModel):
    """Group of ingredients with a purpose/label."""
    purpose: str | None = None
    ingredients: list[str] = Field(default_factory=list)


class ParseRecipeResponse(SQLModel):
    """
    Response model for the parse_recipe endpoint.
    Contains all possible fields from recipe_scrapers.AbstractScraper.to_json().
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
