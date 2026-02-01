# SQLModel Architecture Refactoring Summary

## Overview
Refactored the monolithic `backend/app/models.py` into a modular `models/` package organized by domain, with complete CRUD operations for all resources.

## New Structure

```
backend/app/models/
├── __init__.py          # Central exports for backward compatibility
├── base.py              # Shared utilities (get_datetime_utc)
├── auth.py              # Authentication & utility models
├── user.py              # User domain models
├── item.py              # Item domain models
└── recipe.py            # Recipe domain models
```

## Domain Organization

### 📦 base.py
**Purpose**: Shared utilities and helper functions

- `get_datetime_utc()` - UTC datetime generator

### 🔐 auth.py
**Purpose**: Authentication and generic API models

**Models**:
- `Message` - Generic API response messages
- `Token` - OAuth2 access token response
- `TokenPayload` - JWT token payload contents
- `NewPassword` - Password reset request schema

### 👤 user.py
**Purpose**: User management and authentication

**Database Table**:
- `User` (table=True)
  - Primary key: `id` (UUID)
  - Fields: `email`, `hashed_password`, `is_active`, `is_superuser`, `full_name`, `created_at`
  - Relationships: `items` (1-to-many), `recipes` (1-to-many)

**Request Schemas**:
- `UserCreate` - Admin user creation
- `UserRegister` - Public self-registration
- `UserUpdate` - Admin user update
- `UserUpdateMe` - Self profile update
- `UpdatePassword` - Password change

**Response Schemas**:
- `UserPublic` - Single user response
- `UsersPublic` - Paginated users list

### 📋 item.py
**Purpose**: Simple item/task management

**Database Table**:
- `Item` (table=True)
  - Primary key: `id` (UUID)
  - Fields: `title`, `description`, `created_at`
  - Foreign key: `owner_id` → `user.id` (CASCADE)
  - Relationships: `owner` (many-to-1 with User)

**Request Schemas**:
- `ItemCreate` - Create new item
- `ItemUpdate` - Update existing item

**Response Schemas**:
- `ItemPublic` - Single item response
- `ItemsPublic` - Paginated items list

### 🍳 recipe.py
**Purpose**: Recipe storage and web scraping

**Database Table**:
- `Recipe` (table=True)
  - Primary key: `id` (UUID)
  - Fields: `title`, `url`, `image`, `site_name`, `created_at`
  - JSON Fields: `ingredients`, `ingredient_groups`, `instructions`, `nutrients`
  - Foreign key: `owner_id` → `user.id` (CASCADE)
  - Relationships: `owner` (many-to-1 with User)

**Request Schemas**:
- `RecipeCreate` - Create new recipe (✨ NEW)
- `RecipeUpdate` - Update existing recipe (✨ NEW)

**Response Schemas**:
- `RecipePublic` - Single recipe response (✨ NEW)
- `RecipesPublic` - Paginated recipes list (✨ NEW)
- `ParseRecipeResponse` - Web scraper response (extensive fields from recipe-scrapers library)
- `IngredientGroup` - Grouped ingredients with purpose

## Database Tables Summary

| Table | Primary Key | Foreign Keys | Cascade Delete | Created |
|-------|------------|--------------|----------------|---------|
| `user` | `id` (UUID) | None | N/A | Existing |
| `item` | `id` (UUID) | `owner_id` → `user.id` | ✅ Yes | Existing |
| `recipe` | `id` (UUID) | `owner_id` → `user.id` | ✅ Yes | Existing |

## API Endpoints

### ✨ NEW: Complete Recipe CRUD in `/api/v1/recipes`

**Migrated from** `/api/v1/recipe_scraper` to `/api/v1/recipes` with full CRUD:

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/recipes/` | List user's recipes (paginated) | ✨ NEW |
| GET | `/recipes/{id}` | Get recipe by ID | ✨ NEW |
| POST | `/recipes/` | Create recipe manually | ✨ NEW |
| PUT | `/recipes/{id}` | Update recipe | ✨ NEW |
| DELETE | `/recipes/{id}` | Delete recipe | ✨ NEW |
| POST | `/recipes/scrape` | Scrape recipe from URL (save optional) | MIGRATED |

**Breaking Change**: `/recipe_scraper/parse_recipe/` → `/recipes/scrape`

### Existing CRUD Endpoints

**Users** (`/api/v1/users`): ✅ Complete  
**Items** (`/api/v1/items`): ✅ Complete  
**Login** (`/api/v1/login`): ✅ Complete  
**Utils** (`/api/v1/utils`): ✅ Complete

## CRUD Operations

### backend/app/crud.py

**✨ NEW Functions**:
```python
def create_recipe(*, session, recipe_in, owner_id) -> Recipe
def update_recipe(*, session, db_recipe, recipe_in) -> Recipe
```

**Existing Functions**:
- `create_user()`, `update_user()`, `get_user_by_email()`, `authenticate()`
- `create_item()`

## Import Compatibility

### Backward Compatible Imports ✅

All existing imports continue to work:
```python
from app.models import User, Item, Recipe, UserCreate, ItemCreate, Message
```

### Internal Package Structure

```python
# models/__init__.py re-exports all models
from app.models.user import User, UserCreate, UserPublic, ...
from app.models.item import Item, ItemCreate, ItemPublic, ...
from app.models.recipe import Recipe, RecipeCreate, RecipePublic, ...
from app.models.auth import Message, Token, TokenPayload, NewPassword
```

## Type Safety

### Forward References Handling

**Problem**: Circular imports between User ↔ Item and User ↔ Recipe

**Solution**: `TYPE_CHECKING` imports in `item.py` and `recipe.py`:
```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.user import User

# Usage in model
owner: "User | None" = Relationship(back_populates="items")
```

## Alembic Migration Strategy

### No Changes Required ✅

**Reason**: Alembic imports `SQLModel.metadata` which automatically discovers all table models:

```python
# backend/app/alembic/env.py
from app.models import SQLModel  # Imports from models/__init__.py
target_metadata = SQLModel.metadata  # Auto-discovers User, Item, Recipe
```

### Future Migrations

Run inside backend container:
```bash
# Create migration
alembic revision --autogenerate -m "Your message"

# Apply migration
alembic upgrade head
```

## Documentation

### Comprehensive Docstrings Added ✅

Every model class includes:
- **Purpose**: What the model represents
- **Usage**: Which endpoints use it
- **Database details**: For table models (relationships, foreign keys, table name)
- **Field descriptions**: For complex schemas

Example:
```python
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
```

## Testing Updates

### Updated Test Files

**backend/tests/api/routes/test_recipe_scraper.py**:
- Updated import path: `app.api.routes.recipe_scraper` → `app.api.routes.recipes`
- Updated endpoint: `/recipe_scraper/parse_recipe/` → `/recipes/scrape`
- All 4 tests updated ✅

## Files Modified

### Created (7 files)
- `backend/app/models/__init__.py`
- `backend/app/models/base.py`
- `backend/app/models/user.py`
- `backend/app/models/item.py`
- `backend/app/models/recipe.py`
- `backend/app/models/auth.py`
- `backend/app/api/routes/recipes.py`

### Modified (4 files)
- `backend/app/crud.py` - Added `create_recipe()`, `update_recipe()`
- `backend/app/api/main.py` - Changed router from `recipe_scraper` to `recipes`
- `backend/tests/api/routes/test_recipe_scraper.py` - Updated endpoints and imports

### Deleted (2 files)
- ❌ `backend/app/models.py` (204 lines → split into modules)
- ❌ `backend/app/api/routes/recipe_scraper.py` (replaced by `recipes.py`)

## Benefits

### ✅ Clarity
- **Clear separation**: Database tables vs API schemas
- **Domain organization**: Related models grouped together
- **Easy navigation**: Find user models in `user.py`, recipes in `recipe.py`

### ✅ Maintainability
- **Modular**: Each domain can be edited independently
- **Scalable**: Easy to add new domains (e.g., `meal_plan.py`, `shopping_list.py`)
- **Documentation**: Every model has clear purpose and usage docs

### ✅ Completeness
- **Full CRUD**: Recipe now has complete CRUD operations (was missing GET, UPDATE, DELETE)
- **Consistency**: Recipe follows same pattern as User and Item
- **API parity**: All resources have consistent endpoint structure

### ✅ Type Safety
- **No circular imports**: TYPE_CHECKING prevents import cycles
- **Forward references**: Proper relationship type hints
- **Backward compatible**: Existing code requires no changes

## Next Steps

### Optional Enhancements

1. **Frontend Client Generation**
   ```bash
   bash scripts/generate-client.sh
   ```
   Regenerate TypeScript client to include new Recipe CRUD endpoints

2. **Add Recipe Tests**
   Create `backend/tests/api/routes/test_recipes.py` with tests for:
   - GET `/recipes/`
   - GET `/recipes/{id}`
   - POST `/recipes/`
   - PUT `/recipes/{id}`
   - DELETE `/recipes/{id}`

3. **Extend Recipe Model** (Future)
   Consider adding fields:
   - `prep_time`, `cook_time`, `total_time` (currently only in scraper response)
   - `servings`, `category`, `cuisine`
   - `ratings`, `author`, `description`

4. **Add More Domains** (Future)
   - `models/meal_plan.py` - Meal planning
   - `models/shopping_list.py` - Grocery lists
   - `models/favorite.py` - User favorites/bookmarks

## Migration Checklist for Development

- [x] Create models package structure
- [x] Move and organize all models
- [x] Add comprehensive docstrings
- [x] Implement Recipe CRUD operations
- [x] Create Recipe API routes
- [x] Update API router
- [x] Update tests
- [x] Delete old files
- [x] Verify Alembic compatibility
- [ ] Regenerate frontend client (optional)
- [ ] Run tests to verify functionality
- [ ] Deploy and test in local Docker environment
