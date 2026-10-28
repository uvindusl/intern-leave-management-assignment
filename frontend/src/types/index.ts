export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  created_at: string;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type: "ANNUAL" | "CASUAL" | "MEDICAL";
  start_date: string;
  end_date: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}
