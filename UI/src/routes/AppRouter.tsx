import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AddCandidate from "../pages/Candidate Management/candidate/AddCandidate";
import LoginForm from "../pages/Auth/LoginForm";
import AuthLayout from "../layouts/AuthLayout";
import CandidateListPage from "../pages/Candidate Management/candidate/CandidateList";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import CandidateDetails from "../pages/Candidate Management/candidate/CandidateDetails";
import EmployeesPage from "../pages/Employee Management/Employee/Employees";
import { EmployeeForm } from "../pages/Employee Management/Employee/AddEditEmployee";
import { EmployeeDetails } from "../pages/Employee Management/Employee/EmployeeDetails";
import { LeaveForm } from "../pages/Employee Management/Leave/AddEditLeave";
import { LeavePage } from "../pages/Employee Management/Leave/Leaves";
import { Assets } from "../pages/Employee Management/EmployeeAssets/AssistPage";
import { InterviewPage } from "../pages/Candidate Management/Candidate Interview/InterviewPage";
import { GetLeads } from "../pages/Leads/GetLeads";
import { LeadForm } from "../pages/Leads/AddEditLeads";
import Calendar from "../pages/Calendar Management/Calendar";
import { EventsPage } from "../pages/Calendar Management/EventsPage";
import { ChangePassword } from "../pages/Auth/ChangePassword";
import { ResetPassword } from "../pages/Auth/ResetPassword";
import { ForgotPassword } from "../pages/Auth/ForgotPassword";
import AttendanceHistoryTable from "../pages/Employee Management/Attendance/AttendanceHistoryTable";
import EmployeeDocumentManagement from "../pages/Employee Management/EmployeeDocument/EmployeeDocumentManagement";
import PayrollManagement from "../pages/Employee Management/Payroll/PayrollManagement";
import PerformanceReviewManagement from "../pages/Employee Management/PerformanceReview/PerformanceReviewManagement";

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirect root path to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* AuthLayout is used for authentication routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* MainLayout is used for main routes after login */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/candidates" element={<CandidateListPage />} />
        <Route path="/candidates/add-candidate" element={<AddCandidate />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route
          path="/candidates/candidate-Details"
          element={<CandidateDetails />}
        />
        <Route
          path="/interview/candidate-Details"
          element={<CandidateDetails />}
        />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/Add-Employee" element={<EmployeeForm />} />
        <Route path="/employees/Edit-Employee" element={<EmployeeForm />} />
        <Route
          path="/employees/Employee-Details"
          element={<EmployeeDetails />}
        />
        <Route path="/Leaves" element={<LeavePage />} />
        <Route path="/Leaves/Add-Leave" element={<LeaveForm />} />
        <Route path="/Leaves/Edit-Leave" element={<LeaveForm />} />
        <Route path="/Assets" element={<Assets />} />
        <Route path="/Attendance" element={<AttendanceHistoryTable />} />
        <Route
          path="/EmployeeDocument"
          element={<EmployeeDocumentManagement />}
        />
        <Route path="/Payroll" element={<PayrollManagement />} />
        <Route
          path="/PerformanceReview"
          element={<PerformanceReviewManagement />}
        />
        <Route path="/Leads" element={<GetLeads />} />
        <Route path="/Leads/Add-Leads" element={<LeadForm />} />
        <Route path="/Leads/Edit-Leads" element={<LeadForm />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/Events" element={<EventsPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
      {/* Redirect all other paths to login */}
      <Route path="/*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
