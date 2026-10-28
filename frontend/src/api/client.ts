import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const employeeApi = {
  create: (data: EmployeeCreate) => api.post<EmployeeOut>("/employees/", data),
  getAll: () => api.get<EmployeeOut[]>("/employees/"),
};

export const leaveApi = {
  create: (data: LeaveRequestCreate) => api.post<LeaveRequestOut>("/leaves/", data),
  getAll: () => api.get<LeaveRequestOut[]>("/leaves/"),
  approve: (id: number) => api.patch<LeaveRequestOut>(`/leaves/${id}/approve`),
  reject: (id: number, rejection_reason: string) =>
    api.patch<LeaveRequestOut>(`/leaves/${id}/reject`, { rejection_reason }),
};

export interface EmployeeCreate {
  name: string;
  email: string;
  department: string;
}

export interface EmployeeOut {
  id: number;
  name: string;
  email: string;
  department: string;
  created_at: string;
}

export interface LeaveRequestCreate {
  employee_id: number;
  leave_type: "ANNUAL" | "CASUAL" | "MEDICAL";
  start_date: string;
  end_date: string;
  reason: string;
}

export interface LeaveRequestOut {
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
  employee?: EmployeeOut;
}

export default api;
