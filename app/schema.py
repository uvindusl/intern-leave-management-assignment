from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import date, datetime
from typing import Optional
from .models import LeaveType, LeaveStatus


class EmployeeBase(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    department: str = Field(..., min_length=1)


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeOut(EmployeeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class LeaveRequestBase(BaseModel):
    employee_id: int
    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: str = Field(..., min_length=1)

    @field_validator("end_date")
    @classmethod
    def validate_date_range(cls, v, info):
        start_date = info.data.get("start_date")
        if start_date and v < start_date:
            raise ValueError("End date cannot be before start date")
        return v


class LeaveRequestCreate(LeaveRequestBase):
    pass


class EmployeeForLeave(BaseModel):
    id: int
    name: str
    email: EmailStr
    department: str

    class Config:
        from_attributes = True


class LeaveRequestOut(BaseModel):
    id: int
    employee_id: int
    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: str
    status: LeaveStatus
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    employee: Optional[EmployeeForLeave] = None

    class Config:
        from_attributes = True


class LeaveReject(BaseModel):
    rejection_reason: str = Field(..., min_length=1)
