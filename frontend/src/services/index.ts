import api from './axios';

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
  leave_type: 'ANNUAL' | 'CASUAL' | 'MEDICAL';
  start_date: string;
  end_date: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  employee?: Employee;
}

export const employeeService = {
  getAll: () => api.get<Employee[]>('/employees/'),
  create: (data: { name: string; email: string; department: string }) =>
    api.post<Employee>('/employees/', data),
};

export const leaveService = {
  getAll: () => api.get<LeaveRequest[]>('/leaves/'),
  create: (data: {
    employee_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
  }) => api.post<LeaveRequest>('/leaves/', data),
  approve: (id: number) => api.patch<LeaveRequest>(`/leaves/${id}/approve`),
  reject: (id: number, rejection_reason: string) =>
    api.patch<LeaveRequest>(`/leaves/${id}/reject`, { rejection_reason }),
};
