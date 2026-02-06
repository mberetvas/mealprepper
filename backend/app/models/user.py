"""
User models for database tables, request/response schemas, and authentication.

Database Tables:
    - User: Main user table with authentication and profile data

Request Schemas:
    - UserCreate: Create a new user (admin only)
    - UserRegister: Public user registration
    - UserUpdate: Update user (admin only)
    - UserUpdateMe: Update own user profile
    - UpdatePassword: Change user password

Response Schemas:
    - UserPublic: Public user information
    - UsersPublic: Paginated list of users
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from pydantic import EmailStr
from sqlalchemy import DateTime
from sqlmodel import Field, Relationship, SQLModel

from app.models.base import get_datetime_utc

if TYPE_CHECKING:
    from app.models.recipe import Recipe


# Shared properties
class UserBase(SQLModel):
    """
    Base user properties shared across create/update schemas.
    
    Contains common fields for user management excluding sensitive data.
    """
    
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    """
    Schema for creating a new user via admin API.
    
    Requires password to be set on creation.
    Used by admin endpoints in /users/.
    """
    
    password: str = Field(min_length=8, max_length=128)


class UserRegister(SQLModel):
    """
    Schema for public user registration.
    
    Simplified schema for self-service user signup.
    Used by /signup endpoint.
    """
    
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    """
    Schema for updating a user via admin API.
    
    All fields are optional to support partial updates.
    Used by admin endpoints in /users/{user_id}.
    """
    
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserUpdateMe(SQLModel):
    """
    Schema for users to update their own profile.
    
    Limited fields compared to admin UserUpdate.
    Used by /users/me endpoint.
    """
    
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    """
    Schema for changing user password.
    
    Requires current password for verification.
    Used by /users/me/password endpoint.
    """
    
    current_password: str = Field(min_length=8, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    """
    User database table model.
    
    Stores user authentication and profile information.
    
    Relationships:
        - recipes: One-to-many relationship with Recipe (cascade delete)
    
    Table name: user
    """
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    recipes: list["Recipe"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    """
    Public user information returned by API endpoints.
    
    Excludes sensitive data like hashed_password.
    Used in all user-related API responses.
    """
    
    id: uuid.UUID
    created_at: datetime | None = None


class UsersPublic(SQLModel):
    """
    Paginated list of users for API responses.
    
    Used by /users/ endpoint with skip/limit pagination.
    """
    
    data: list[UserPublic]
    count: int

