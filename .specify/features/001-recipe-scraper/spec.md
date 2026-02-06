# Feature Specification: Recipe Scraper Endpoint

**Feature Branch**: `add-recipe-parser`  
**Created**: 2026-02-06  
**Status**: Implementation (TDD Phase - Tests First)  
**Input**: User request: "Add endpoint to backend that accepts a URL pointing to a recipe and returns parsed recipe data in JSON format"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parse Recipe from URL (Priority: P1) 🎯 MVP

A user wants to import a recipe from a website by providing a URL, without manually entering all the details.

**Why this priority**: Core functionality - enables users to quickly add recipes from the web instead of typing them manually. Delivers immediate value.

**Independent Test**: Can be tested independently by calling the endpoint with any supported recipe URL and verifying the returned JSON contains recipe fields (title, ingredients, instructions, etc.)

**Acceptance Scenarios**:

1. **Given** I provide a valid recipe URL to the `/recipes/scrape` endpoint, **When** I send the request, **Then** I receive a JSON response containing parsed recipe data (title, ingredients, instructions, etc.)
2. **Given** the recipe URL points to a structured recipe page, **When** I scrape it, **Then** the response includes ingredients and instructions as lists
3. **Given** the recipe includes metadata like prepare time or nutrition info, **When** I scrape it, **Then** these fields are included in the response
4. **Given** I request with `save=true`, **When** the scrape succeeds, **Then** the recipe is automatically saved to my database
5. **Given** I request with `save=false` (default), **When** the scrape succeeds, **Then** the recipe is NOT saved to database (just returned)

---

### User Story 2 - Handle Invalid/Inaccessible URLs (Priority: P2)

A user tries to scrape a URL that doesn't exist, isn't accessible, or doesn't contain recipe data.

**Why this priority**: Essential for robustness - prevents server crashes and provides helpful error messages. Enables graceful degradation.

**Independent Test**: Can be tested independently by calling the endpoint with invalid URLs (404, non-recipe pages, timeouts) and verifying appropriate HTTP error responses.

**Acceptance Scenarios**:

1. **Given** I provide a URL that returns 404, **When** I scrape it, **Then** I receive a 400-level HTTP error with a meaningful message
2. **Given** I provide a URL that times out, **When** I scrape it, **Then** I receive a 500-level error with a timeout message
3. **Given** I provide a malformed URL, **When** I scrape it, **Then** I receive a 400 error
4. **Given** I provide a valid URL but it doesn't contain recipe data, **When** I scrape it, **Then** the endpoint either returns minimal data or an error indicating no recipe found
5. **Given** an error occurs during scraping, **When** the `save=true` request fails, **Then** no partial recipe is saved to the database

---

### User Story 3 - Authenticated Access Only (Priority: P2)

The scrape endpoint requires user authentication to prevent abuse and ensure recipes are attributed to the correct user.

**Why this priority**: Security-critical - prevents unauthorized use and ensures data integrity. Aligns with system-wide auth requirements.

**Independent Test**: Can be tested independently by calling the endpoint without/with valid authentication tokens and verifying access is granted/denied appropriately.

**Acceptance Scenarios**:

1. **Given** I am not authenticated, **When** I call `/recipes/scrape`, **Then** I receive a 401 Unauthorized error
2. **Given** I provide an invalid/expired token, **When** I call `/recipes/scrape`, **Then** I receive a 401 Unauthorized error
3. **Given** I am authenticated as a valid user, **When** I call `/recipes/scrape` with a valid URL, **Then** I receive parsed recipe data
4. **Given** I save a scraped recipe with `save=true`, **When** it's written to database, **Then** my user ID is recorded as the owner

---

### Edge Cases

- What happens when the recipe URL redirects to another URL? → Should follow redirects and parse the final destination
- What happens if the HTML contains recipe data but in a format the scraper doesn't recognize? → Should return minimal data (what was recognized) or error
- What if ingredients are grouped (e.g., "For the crust:" vs "For the filling:")? → Should preserve groups in `ingredient_groups` field
- What if the scraper returns null/missing fields? → Should include those fields as null in JSON response, not omit them
- What if the URL is very slow to load? → Should have a reasonable timeout (e.g., 30 seconds) to prevent hanging requests
- What if the endpoint receives concurrent requests for the same URL? → Should handle gracefully without race conditions

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Endpoint MUST accept HTTP POST requests to `/recipes/scrape` with a `url` query parameter
- **FR-002**: Endpoint MUST require Bearer token authentication (via `Authorization: Bearer <token>` header)
- **FR-003**: Endpoint MUST asynchronously fetch HTML content from the provided URL using httpx
- **FR-004**: Endpoint MUST parse HTML using `recipe_scrapers` library to extract recipe data
- **FR-005**: Endpoint MUST return a JSON response matching the `ParseRecipeResponse` schema
- **FR-006**: Endpoint MUST support optional `save` query parameter (default: false)
- **FR-007**: When `save=true`, endpoint MUST create a Recipe record in the database with the parsed data (owner = current user)
- **FR-008**: Endpoint MUST handle HTTP request errors (404, 500, timeout) and return appropriate HTTP error status codes
- **FR-009**: Endpoint MUST handle recipe scraping errors (unparseable content) with meaningful error messages
- **FR-010**: Endpoint MUST NOT save recipes if an error occurs during scraping (transactional consistency)
- **FR-011**: Response MUST include all fields from `ParseRecipeResponse` schema, with null values for missing fields
- **FR-012**: Endpoint MUST follow HTTP redirects when fetching URLs
- **FR-013**: Endpoint MUST use a User-Agent header to avoid being blocked by recipe websites

### Key Entities

- **ParseRecipeResponse**: Response schema containing: title, author, description, image, site_name, ingredients, ingredient_groups, instructions, instruction_list, cook_time, prep_time, total_time, yields, ratings, nutrients, etc.
- **Recipe**: Database record created when `save=true`, with owner_id set to current user, url preserved, and all parsed fields stored

### API Endpoint Contract

```
POST /recipes/scrape
Query Parameters:
  - url (required, string): URL of recipe to scrape
  - save (optional, boolean, default=false): Whether to save the recipe to database

Headers:
  - Authorization: Bearer {token} (required)

Response (200 OK):
  ParseRecipeResponse (JSON)

Error Responses:
  - 400: Bad request (invalid URL format, missing url parameter)
  - 401: Unauthorized (missing or invalid token)
  - 4xx: Fetch failed (URL returned 4xx error)
  - 500: Server error (scraping failed, network timeout, etc.)
```

## Assumptions

- The `recipe_scrapers` library is already installed and available
- HTTP requests should follow redirects (301, 302, etc.)
- Recipe websites will respond within a reasonable timeout (30 seconds assumed)
- Authenticated users are legitimate and request scraping for personal use (no rate limiting required yet)
- The database transaction for saving a recipe will handle concurrent requests correctly
- Host websites allow scraping in their Terms of Service (responsibility of user, not system)

## Success Criteria

1. **Functionality**: Users can scrape recipe data from URLs and receive JSON response in under 5 seconds for typical recipe websites
2. **Data Quality**: At least 80% of well-formatted recipe pages return complete data (title + ingredients + instructions)
3. **Error Handling**: All HTTP and parsing errors return appropriate status codes with helpful error messages within 2 seconds
4. **Security**: Endpoint requires valid Bearer token authentication; unauthenticated requests are rejected with 401
5. **Data Persistence**: When `save=true`, parsed recipes are persisted within the same request transaction; failures don't create partial records
6. **API Compliance**: Response schema matches OpenAPI specification and can be auto-generated for frontend client

