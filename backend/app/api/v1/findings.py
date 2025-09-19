from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.core.tenant_context import with_tenant_context
from app.db.base import get_db
from app.models.finding import Finding
from app.models.user import User
from app.schemas.finding import CreateFindingIn, FindingOut

router = APIRouter(prefix="/findings", tags=["findings"])


@router.get("/", response_model=list[FindingOut])
def list_findings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Finding]:
    with_tenant_context(db, current_user.tenant_id)
    rows = db.query(Finding).order_by(Finding.id.asc()).all()
    return rows


@router.get("/{finding_id}", response_model=FindingOut)
def get_finding(
    finding_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Finding:
    with_tenant_context(db, current_user.tenant_id)
    f = db.query(Finding).filter(Finding.id == finding_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="Finding not found")
    return f


@router.post("/", response_model=FindingOut, status_code=status.HTTP_201_CREATED)
def create_finding(
    payload: CreateFindingIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Finding:
    with_tenant_context(db, current_user.tenant_id)
    f = Finding(
        tenant_id=current_user.tenant_id,
        category=payload.category,
        severity=payload.severity or "medium",
        risk_score=payload.risk_score,
        evidence_json=payload.evidence_json or {},
    )
    db.add(f)
    db.commit()
    db.refresh(f)
    return f
