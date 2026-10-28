from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schema
from ..database import get_db

router = APIRouter(
    prefix="/leaves",
    tags=["Leaves"],
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schema.LeaveRequestOut)
def create_leave_request(leave: schema.LeaveRequestCreate, db: Session = Depends(get_db)):
    # Check if employee exists
    employee = db.query(models.Employee).filter(models.Employee.id == leave.employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with id {leave.employee_id} does not exist",
        )

    # Validate date range
    if leave.end_date < leave.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date cannot be before start date",
        )

    new_leave = models.LeaveRequest(**leave.model_dump())
    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    return new_leave


@router.get("/", response_model=List[schema.LeaveRequestOut])
def get_leave_requests(db: Session = Depends(get_db)):
    leaves = db.query(models.LeaveRequest).all()
    return leaves


@router.patch("/{id}/approve", response_model=schema.LeaveRequestOut)
def approve_leave_request(id: int, db: Session = Depends(get_db)):
    leave_request = db.query(models.LeaveRequest).filter(models.LeaveRequest.id == id).first()
    if not leave_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Leave request with id {id} does not exist",
        )

    if leave_request.status != models.LeaveStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Only pending requests can be approved",
        )

    leave_request.status = models.LeaveStatus.APPROVED
    leave_request.rejection_reason = None
    db.commit()
    db.refresh(leave_request)
    return leave_request


@router.patch("/{id}/reject", response_model=schema.LeaveRequestOut)
def reject_leave_request(id: int, reject_data: schema.LeaveReject, db: Session = Depends(get_db)):
    leave_request = db.query(models.LeaveRequest).filter(models.LeaveRequest.id == id).first()
    if not leave_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Leave request with id {id} does not exist",
        )

    if leave_request.status != models.LeaveStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Only pending requests can be rejected",
        )

    leave_request.status = models.LeaveStatus.REJECTED
    leave_request.rejection_reason = reject_data.rejection_reason
    db.commit()
    db.refresh(leave_request)
    return leave_request
