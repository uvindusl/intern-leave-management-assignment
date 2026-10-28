from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

from .. import models, schema
from ..database import get_db

router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schema.EmployeeOut)
def create_employee(employee: schema.EmployeeCreate, db: Session = Depends(get_db)):
    new_employee = models.Employee(**employee.model_dump())
    db.add(new_employee)
    try:
        db.commit()
        db.refresh(new_employee)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee with this email already exists",
        )
    return new_employee


@router.get("/", response_model=List[schema.EmployeeOut])
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(models.Employee).all()
    return employees
