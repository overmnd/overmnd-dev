from typing import Annotated, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from ..db.session import get_db
from ..core.security import decode_token
from ..models.user import User

bearer_scheme = HTTPBearer(auto_error=False)

# Use Annotated OR default Depends, not both.
DBSession = Annotated[Session, Depends(get_db)]

def get_current_user(
    creds: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: DBSession,
) -> User:
    if creds is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload: Dict[str, Any] = decode_token(creds.credentials)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    if payload.get("scope") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong token scope")
    sub = payload.get("sub")
    user = db.query(User).filter(User.id == int(sub)).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive or missing user")
    return user
