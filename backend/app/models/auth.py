"""
Authentication and utility models for API requests/responses.

Utility Schemas:
    - Message: Generic success/error message response

Authentication Schemas:
    - Token: OAuth2 token response
    - TokenPayload: JWT token contents
    - NewPassword: Password reset request
"""

from sqlmodel import Field, SQLModel


class Message(SQLModel):
    """
    Generic message response for API endpoints.
    
    Used for success confirmations, error messages, and simple responses.
    Examples: "Item deleted successfully", "Email sent", etc.
    """
    
    message: str


class Token(SQLModel):
    """
    OAuth2 token response for authentication endpoints.
    
    Returned by POST /login/access-token endpoint.
    Used by frontend to authenticate subsequent requests.
    """
    
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    """
    Contents of JWT token payload.
    
    Decoded from access_token to identify the authenticated user.
    Used internally by authentication dependency injection.
    """
    
    sub: str | None = None


class NewPassword(SQLModel):
    """
    Schema for password reset request.
    
    Contains reset token from email and new password.
    Used by POST /reset-password/ endpoint.
    """
    
    token: str
    new_password: str = Field(min_length=8, max_length=128)

