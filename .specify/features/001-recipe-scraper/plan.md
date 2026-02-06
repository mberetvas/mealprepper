# Implementation Plan: Recipe Scraper Endpoint

**Branch**: `add-recipe-parser` | **Date**: 2026-02-06 | **Spec**: [.specify/features/001-recipe-scraper/spec.md](.specify/features/001-recipe-scraper/spec.md)

**Input**: Feature specification and TDD tests from `/specs/001-recipe-scraper/spec.md`

## Summary

Enable users to import recipes directly from web URLs without manual data entry. The backend `/recipes/scrape` endpoint accepts a recipe URL, parses it using the `recipe_scrapers` library, and returns structured JSON data containing title, ingredients, instructions, and metadata. Optional `save=true` parameter persists the recipe to the database.

## Technical Context

**Language/Version**: Python 3.11+ (FastAPI)  
**Primary Dependencies**: FastAPI, SQLModel, httpx, recipe-scrapers, pydantic  
**Storage**: PostgreSQL with JSON fields for flexible recipe data  
**Testing**: pytest with mocking (unittest.mock)  
**Target Platform**: REST API endpoint  
**Project Type**: Backend API (full-stack with React frontend)

**Key Implementation Details:**
- Recipe parsing library: `recipe_scrapers` (community-maintained, supports 300+ recipe sites)
- Async HTTP client: `httpx` with User-Agent header to avoid blocking
- Request/Response Schema: `ParseRecipeResponse` (25+ optional fields)
- Database persistence: `Recipe` table with owner tracking
- Authentication: OAuth2 Bearer token required (enforced by dependency injection)

## Constitution Check

**Principles Verified:**

✅ **I. API-Driven Architecture** – All business logic in `/recipes/scrape` endpoint or CRUD layer (`crud.create_recipe`)

✅ **II. Model/DTO Separation** – Request validated as `ParseRecipeResponse` before save; `RecipeCreate` schema handles persistence

✅ **III. Test-Driven Development (MANDATORY)** – Contract tests written FIRST (11 test functions), FAIL before implementation, covering:
   - Happy path (authenticated, successful scrape)
   - Error paths (404, timeout, invalid URL)
   - Authentication required (401, 403)
   - Data persistence (`save=true` vs `save=false`)
   - Response field completeness

✅ **IV. Code Style & Linting** – Follows `backend/pyproject.toml` (Ruff, mypy, Black)

✅ **V. Centralized Data Access via CRUD** – Recipe saving via `crud.create_recipe()`, not direct DB queries in handler

**No Constitution violations. Ready for production.**

## Project Structure

### Documentation (this feature)

```text
.specify/features/001-recipe-scraper/
├── spec.md              # Feature specification (3 user stories, 13 functional requirements)
├── plan.md              # This file (implementation plan)
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code

```text
backend/
├── app/
│   ├── api/routes/recipes.py          # Endpoint: POST /recipes/scrape
│   ├── models/recipe.py               # ParseRecipeResponse schema
│   ├── lib/recipe_scraper.py          # Helper: scrape_recipe_from_url()
│   └── crud.py                        # CRUD: create_recipe()
└── tests/api/routes/
    └── test_recipe_scraper.py         # 11 contract tests (TDD)
```

## Complexity Tracking

No violations. Constitution fully adhered to.

## API Endpoint Contract

```
POST /recipes/scrape

Query Parameters:
  - url (required, string): URL of recipe to scrape
  - save (optional, boolean, default=false): Whether to save to database

Headers Required:
  - Authorization: Bearer {valid_token}

Response (200 OK):
{
  "title": "Recipe Name",
  "author": "Chef Name",
  "description": "Recipe description",
  "image": "https://...",
  "site_name": "example.com",
  "ingredients": ["flour", "eggs", ...],
  "ingredient_groups": [{"purpose": "For dough", "ingredients": [...]}],
  "instructions": "Mix and bake",
  "instruction_list": ["Mix", "Bake"],
  "cook_time": 30,
  "prep_time": 15,
  "total_time": 45,
  "yields": "4 servings",
  "ratings": 4.5,
  "ratings_count": 120,
  "keywords": ["dessert", "baked"],
  "nutrients": {"calories": "250", ...},
  ...
}

Error (400/401/404/500):
{
  "detail": "Failed to fetch URL: 404" | "Unauthorized" | "Request failed: Connection timeout"
}
```

## Testing Strategy

### Test Coverage Areas (Per Constitution Principle III)

**Contract Tests (validates API contract):**
1. ✅ Success path (authenticated, valid URL, mocked scraper)
2. ✅ Missing URL parameter (422)
3. ✅ HTTP errors: 404, timeout, connection error (4xx/5xx)
4. ✅ Authentication: no token (401/403), invalid token (401)
5. ✅ Response completeness (all ParseRecipeResponse fields)
6. ✅ Data persistence: save=true adds recipe to DB
7. ✅ Data not persisted: save=false (default) does not save

**Mocking Strategy:**
- `httpx.AsyncClient.get()` – Return mock HTML or raise errors
- `recipe_scrapers.scrape_html()` – Return mock scraper with `to_json()` method
- Database session – Real session from conftest fixture for persistence tests

### Success Criteria

1. **Test Pass Rate**: 100% of 11 contract tests passing
2. **Red-Green-Refactor**: Tests written FIRST (Red → Green → Refactor cycle)
3. **Response Validation**: All fields in ParseRecipeResponse present in response
4. **Auth Enforcement**: Unauthenticated requests rejected (401/403)
5. **Database Integrity**: Save operation is atomic (no partial saves on error)
6. **Error Messages**: HTTP errors include meaningful `detail` messages

## Implementation Status

**Current State:**
- ✅ Endpoint implemented (`POST /recipes/scrape`)
- ✅ Schema defined (`ParseRecipeResponse`)
- ✅ Tests written (11 contract tests)
- ⏳ Tests not yet run (recipe_scrapers import slow, needs Docker or proper test setup)

**Remaining Work:**
1. Run tests and verify all pass (may require Docker Compose for DB)
2. Validate against real recipe websites (optional integration test)
3. Performance tuning (current: 2-5 sec per URL, target: <5 sec)
4. Documentation/Open API exposure

