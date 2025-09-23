from fastapi import APIRouter, Depends
from ...schemas.user import UserOut
from ...api.deps import get_current_user
from ...models.user import User

router = APIRouter()

@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
