import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus, Edit, Trash2, Eye, Download, Upload,
  Users, DollarSign, Calendar, FileText,
  CreditCard, Clock, Building, UserCheck
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  hire_date: string;
  basic_salary: number;
  bank_account: string;
  bank_name: string;
  ifsc_code: string;
  pan_number: string;
  status: 'active' | 'inactive';
}

interface PayrollComponent {
  id: number;
  name: string;
  type: 'allowance' | 'deduction';
  calculation_type: 'fixed' | 'percentage';
  value: number;
  description: string;
  status: 'active' | 'inactive';
}

interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  check_in: string;
  check_out: string;
  status: 'present' | 'absent' | 'half_day' | 'leave' | 'holiday';
  overtime_hours: number;
  notes: string;
}

interface PayrollRecord {
  id: number;
  payroll_period_id: number;
  employee_id: number;
  days_worked: number;
  days_present: number;
  days_absent: number;
  days_leave: number;
  basic_salary: number;
  allowances: any[];
  deductions: any[];
  overtime_amount: number;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  payment_date: string;
  employee?: Employee; // Add optional employee details
}

interface SalarySlip {
  id: number;
  payroll_record_id: number;
  slip_number: string;
  slip_data: {
    slip_number: string;
    employee: {
      name: string;
      employee_code: string;
      department: string;
      designation: string;
    };
    period: {
      name: string;
      start_date: string;
      end_date: string;
    };
    salary_details: {
      basic_salary: number;
      allowances: any[];
      deductions: any[];
      overtime_amount: number;
      gross_salary: number;
      total_deductions: number;
      net_salary: number;
    };
    payment_details: {
      bank_name: string;
      account_number: string;
      ifsc_code: string;
    };
  };
  generated_at: string;
}

const PayrollManagement = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [components, setComponents] = useState<PayrollComponent[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);

  // Dialog states
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isComponentDialogOpen, setIsComponentDialogOpen] = useState(false);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [isPayrollDialogOpen, setIsPayrollDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewSalarySlipOpen, setIsViewSalarySlipOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [formData, setFormData] = useState<any>({});

  const API_BASE_URL = "https://api.binxtrade.in/adminapi/payroll_api.php";

  // Fetch data
  useEffect(() => {
    fetchEmployees();
    fetchComponents();
    fetchPayrollRecords();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchComponents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/components`);
      const data = await response.json();
      if (data.success) {
        setComponents(data.data);
      }
    } catch (error) {
      console.error("Error fetching components:", error);
    }
  };

  const fetchPayrollRecords = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payroll`);
      const data = await response.json();
      if (data.success) {
        setPayrollRecords(data.data);
      }
    } catch (error) {
      console.error("Error fetching payroll records:", error);
    }
  };

  const handleAddEmployee = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        fetchEmployees();
        setIsEmployeeDialogOpen(false);
        setFormData({});
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      const response = await fetch(`${API_BASE_URL}/employees/${selectedEmployee.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        fetchEmployees();
        setIsDeleteDialogOpen(false);
        setSelectedEmployee(null);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };


  const createPayrollPeriod = async (periodData: any) => {
    try {
      const response = await fetch(`https://api.binxtrade.in/adminapi/payroll_api.php?endpoint=create-period`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(periodData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating payroll period:", error);
      return null;
    }
  };

  const handleProcessPayroll = async () => {
    try {
      // 1. First create a payroll period
      const periodData = {
        period_name: formData.period_name || `Salary Period ${new Date().toLocaleDateString()}`,
        start_date: formData.start_date,
        end_date: formData.end_date,
        payment_date: formData.payment_date || formData.end_date
      };

      console.log('Creating payroll period:', periodData);

      const periodResult = await createPayrollPeriod(periodData);

      if (!periodResult || !periodResult.success) {
        alert(`Failed to create payroll period: ${periodResult?.message || 'Unknown error'}`);
        return;
      }

      const periodId = periodResult.period_id;

      // 2. Then process payroll with the created period ID
      console.log('Processing payroll for period ID:', periodId);

      const response = await fetch(`https://api.binxtrade.in/adminapi/payroll_api.php?endpoint=process-payroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period_id: periodId })
      });

      const data = await response.json();
      console.log('Payroll processing response:', data);

      if (data.success) {
        fetchPayrollRecords();
        setIsPayrollDialogOpen(false);
        setFormData({});
        alert('Payroll processed successfully!');
      } else {
        alert(`Error processing payroll: ${data.message}`);
      }
    } catch (error) {
      console.error("Error in payroll process:", error);
      alert('Error processing payroll. Check console for details.');
    }
  };

  const handleGenerateSalarySlip = async (recordId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-slip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payroll_record_id: recordId })
      });

      const data = await response.json();
      if (data.success) {
        // Add slip data to salarySlips array
        const newSlip: SalarySlip = {
          id: Date.now(), // Temporary ID, should come from API
          payroll_record_id: recordId,
          slip_number: data.data.slip_number,
          slip_data: data.data,
          generated_at: new Date().toISOString()
        };

        setSalarySlips(prev => [...prev, newSlip]);
        setSelectedSalarySlip(newSlip);
        setIsViewSalarySlipOpen(true);
      }
    } catch (error) {
      console.error("Error generating salary slip:", error);
    }
  };


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const totalMonthlySalary = employees.reduce((sum, emp) => sum + (emp.basic_salary || 0), 0);
  const pendingPayments = payrollRecords.filter(r => r.payment_status === 'pending').length;
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);
  const [selectedSalarySlip, setSelectedSalarySlip] = useState<SalarySlip | null>(null);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Payroll Management</h1>
            <p className="text-muted-foreground mt-1">Manage employees, attendance, and payroll processing</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsPayrollDialogOpen(true)} className="btn-glow">
              <Calendar className="w-4 h-4 mr-2" />
              Process Payroll
            </Button>
            <Button onClick={() => setIsEmployeeDialogOpen(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Employees</p>
                <p className="text-2xl font-bold text-accent">{activeEmployees}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Salary</p>
                <p className="text-2xl font-bold">{formatCurrency(totalMonthlySalary)}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold">{pendingPayments}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {employees.map((employee, i) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className={cn(
                    "p-5 h-full",
                    employee.status === "inactive" && "opacity-60"
                  )}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{employee.first_name} {employee.last_name}</h3>
                        <p className="text-sm text-muted-foreground">{employee.employee_code}</p>
                      </div>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        employee.status === "active" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                      )}>
                        {employee.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        {employee.department} • {employee.designation}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        {formatCurrency(employee.basic_salary)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Joined: {new Date(employee.hire_date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setFormData(employee);
                          setIsEmployeeDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-secondary border-secondary/50 hover:bg-secondary/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Payroll Components Tab */}
          <TabsContent value="components" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Salary Components</h3>
              <Button onClick={() => setIsComponentDialogOpen(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Component
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard className="p-5">
                <h4 className="font-semibold text-accent mb-4">Allowances</h4>
                <div className="space-y-3">
                  {components.filter(c => c.type === 'allowance').map((component) => (
                    <div key={component.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">{component.name}</p>
                        <p className="text-sm text-muted-foreground">{component.description}</p>
                      </div>
                      <span className="font-mono-trading font-semibold">
                        {component.calculation_type === 'percentage' ? `${component.value}%` : formatCurrency(component.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <h4 className="font-semibold text-secondary mb-4">Deductions</h4>
                <div className="space-y-3">
                  {components.filter(c => c.type === 'deduction').map((component) => (
                    <div key={component.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">{component.name}</p>
                        <p className="text-sm text-muted-foreground">{component.description}</p>
                      </div>
                      <span className="font-mono-trading font-semibold">
                        {component.calculation_type === 'percentage' ? `${component.value}%` : formatCurrency(component.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          {/* Payroll Tab */}
          <TabsContent value="payroll" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Slip No.</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Period</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Basic Salary</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Net Salary</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollRecords.map((record) => {
                    const employee = employees.find(e => e.id === record.employee_id);
                    return (
                      <tr key={record.id} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="py-3 px-4">
                          <span className="font-mono-trading text-sm">PR-{record.id.toString().padStart(6, '0')}</span>
                        </td>
                        <td className="py-3 px-4">
                          {employee ? `${employee.first_name} ${employee.last_name}` : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {record.days_present} days
                        </td>
                        <td className="py-3 px-4 font-mono-trading">
                          {formatCurrency(record.basic_salary)}
                        </td>
                        <td className="py-3 px-4 font-mono-trading font-semibold">
                          {formatCurrency(record.net_salary)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            record.payment_status === 'paid' ? "bg-accent/20 text-accent" :
                              record.payment_status === 'pending' ? "bg-warning/20 text-warning" :
                                "bg-secondary/20 text-secondary"
                          )}>
                            {record.payment_status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateSalarySlip(record.id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-accent border-accent/50 hover:bg-accent/10"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Employee Dialog */}
        <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
          <DialogContent className="glass-card border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Employee Code</Label>
                  <Input
                    value={formData.employee_code || ''}
                    onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                    placeholder="EMP001"
                  />
                </div>
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={formData.first_name || ''}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={formData.last_name || ''}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select
                    value={formData.department || ''}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Designation</Label>
                  <Input
                    value={formData.designation || ''}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label>Hire Date</Label>
                  <Input
                    type="date"
                    value={formData.hire_date || ''}
                    onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Basic Salary (₹)</Label>
                  <Input
                    type="number"
                    value={formData.basic_salary || ''}
                    onChange={(e) => setFormData({ ...formData, basic_salary: parseFloat(e.target.value) })}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label>Bank Account Number</Label>
                  <Input
                    value={formData.bank_account || ''}
                    onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <Label>Bank Name</Label>
                  <Input
                    value={formData.bank_name || ''}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    placeholder="State Bank of India"
                  />
                </div>
                <div>
                  <Label>IFSC Code</Label>
                  <Input
                    value={formData.ifsc_code || ''}
                    onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value })}
                    placeholder="SBIN0001234"
                  />
                </div>
                <div>
                  <Label>PAN Number</Label>
                  <Input
                    value={formData.pan_number || ''}
                    onChange={(e) => setFormData({ ...formData, pan_number: e.target.value })}
                    placeholder="ABCDE1234F"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={formData.status || 'active'}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={selectedEmployee ? () => {/* Update logic */ } : handleAddEmployee} className="btn-glow">
                {selectedEmployee ? 'Update Employee' : 'Add Employee'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Process Payroll Dialog */}
        <Dialog open={isPayrollDialogOpen} onOpenChange={setIsPayrollDialogOpen}>
          <DialogContent className="glass-card border-border/50 max-w-md">
            <DialogHeader>
              <DialogTitle>Process Payroll</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Period Name</Label>
                <Input
                  value={formData.period_name || ''}
                  onChange={(e) => setFormData({ ...formData, period_name: e.target.value })}
                  placeholder="January 2024 Salary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.start_date || ''}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date || ''}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Payment Date</Label>
                <Input
                  type="date"
                  value={formData.payment_date || ''}
                  onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPayrollDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleProcessPayroll} className="btn-glow">
                Process Payroll
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Salary Slip Dialog */}
        <Dialog open={isViewSalarySlipOpen} onOpenChange={setIsViewSalarySlipOpen}>
          <DialogContent className="glass-card border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Salary Slip</DialogTitle>
            </DialogHeader>
            {selectedSalarySlip && (
              <div className="space-y-6">
                <div className="border rounded-lg p-6 bg-white dark:bg-gray-900">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">SALARY SLIP</h2>
                    <p className="text-muted-foreground">Slip No: {selectedSalarySlip.slip_number}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">Employee Information</h3>
                      <p className="text-sm">Name: {selectedSalarySlip.slip_data.employee.name}</p>
                      <p className="text-sm">Employee Code: {selectedSalarySlip.slip_data.employee.employee_code}</p>
                      <p className="text-sm">Department: {selectedSalarySlip.slip_data.employee.department}</p>
                      <p className="text-sm">Designation: {selectedSalarySlip.slip_data.employee.designation}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Payroll Period</h3>
                      <p className="text-sm">Period: {selectedSalarySlip.slip_data.period.name}</p>
                      <p className="text-sm">From: {selectedSalarySlip.slip_data.period.start_date}</p>
                      <p className="text-sm">To: {selectedSalarySlip.slip_data.period.end_date}</p>
                    </div>
                  </div>

                  {/* Rest of the slip content using selectedSalarySlip.slip_data */}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="glass-card border-border/50 max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Employee</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Are you sure you want to delete <strong>{selectedEmployee?.first_name} {selectedEmployee?.last_name}</strong>? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteEmployee}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default PayrollManagement;