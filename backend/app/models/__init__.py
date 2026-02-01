"""
SQLModel models package.

This package organizes database tables and API schemas by domain:
- auth: Authentication and utility models (Message, Token, etc.)
- user: User management models (User table, UserCreate, UserPublic, etc.)
- item: Item/task models (Item table, ItemCreate, ItemPublic, etc.)
- recipe: Recipe models (Recipe table, RecipeCreate, RecipePublic, etc.)

All models are re-exported here to maintain backward compatibility with
existing imports like: from app.models import User, Item, Recipe
"""

from sqlmodel import SQLModel

from app.models.auth import Message, NewPassword, Token, TokenPayload
from app.models.item import Item, ItemCreate, ItemPublic, ItemsPublic, ItemUpdate
from app.models.recipe import (
    IngredientGroup,
    ParseRecipeResponse,
    Recipe,
    RecipeCreate,
    RecipePublic,
    RecipesPublic,
    RecipeUpdate,
)
from app.models.user import (
    UpdatePassword,
    User,
    UserCreate,
    UserPublic,
    UserRegister,
    UsersPublic,
    UserUpdate,
    UserUpdateMe,
)

__all__ = [
    # SQLModel base
    "SQLModel",
    # Auth models
    "Message",
    "NewPassword",
    "Token",
    "TokenPayload",
    # User models
    "User",
    "UserCreate",
    "UserRegister",
    "UserUpdate",
    "UserUpdateMe",
    "UpdatePassword",
    "UserPublic",
    "UsersPublic",
    # Item models
    "Item",
    "ItemCreate",
    "ItemUpdate",
    "ItemPublic",
    "ItemsPublic",
    # Recipe models
    "Recipe",
    "RecipeCreate",
    "RecipeUpdate",
    "RecipePublic",
    "RecipesPublic",
    "IngredientGroup",
    "ParseRecipeResponse",
]

