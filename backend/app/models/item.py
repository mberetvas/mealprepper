"""
Item models for database tables and request/response schemas.

Database Tables:
    - Item: Simple item/task table with owner relationship

Request Schemas:
    - ItemCreate: Create a new item
    - ItemUpdate: Update an existing item

Response Schemas:
    - ItemPublic: Public item information
    - ItemsPublic: Paginated list of items
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime
from sqlmodel import Field, Relationship, SQLModel

from app.models.base import get_datetime_utc

if TYPE_CHECKING:
    from app.models.user import User


# Shared properties
class ItemBase(SQLModel):
    """
    Base item properties shared across create/update schemas.
    
    Contains common fields for item management.
    """
    
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    """
    Schema for creating a new item via API.
    
    Inherits all fields from ItemBase.
    Owner is set automatically from authenticated user.
    Used by POST /items/ endpoint.
    """
    
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    """
    Schema for updating an existing item via API.
    
    All fields are optional to support partial updates.
    Used by PUT /items/{id} endpoint.
    """
    
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    """
    Item database table model.
    
    Stores user-created items/tasks.
    
    Relationships:
        - owner: Many-to-one relationship with User
    
    Foreign Keys:
        - owner_id: References user.id (CASCADE on delete)
    
    Table name: item
    """
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime | None = Field(
        default_factory=get_datetime_utc,
        sa_type=DateTime(timezone=True),  # type: ignore
    )
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: "User" | None = Relationship(back_populates="items")  # type: ignore


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    """
    Public item information returned by API endpoints.
    
    Includes item ID and owner ID for access control.
    Used in all item-related API responses.
    """
    
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime | None = None


class ItemsPublic(SQLModel):
    """
    Paginated list of items for API responses.
    
    Used by GET /items/ endpoint with skip/limit pagination.
    """
    
    data: list[ItemPublic]
    count: int

