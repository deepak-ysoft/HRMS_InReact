import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AddCandidate from "../pages/Candidate Management/candidate/AddCandidate";
import LoginForm from "../pages/sign/LoginForm";
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

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirect root path to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* AuthLayout is used for authentication routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginForm />} />
      </Route>

      {/* MainLayout is used for main routes after login */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/candidates" element={<CandidateListPage />} />
        <Route path="/candidates/add-candidate" element={<AddCandidate />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route
          path="/candidates/candidateDetails"
          element={<CandidateDetails />}
        />
        <Route
          path="/interview/candidateDetails"
          element={<CandidateDetails />}
        />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/AddEmployee" element={<EmployeeForm />} />
        <Route
          path="/employees/EmployeeDetails"
          element={<EmployeeDetails />}
        />
        <Route path="/Leaves" element={<LeavePage />} />
        <Route path="/Leaves/AddEditLeave" element={<LeaveForm />} />
        <Route path="/Assets" element={<Assets />} />

        <Route path="/Leads" element={<GetLeads />} />
        <Route path="/Leads/AddEditLeads" element={<LeadForm />} />
        <Route path="/Calendar" element={<Calendar />} />
      </Route>
      {/* Redirect all other paths to login */}
      <Route path="/*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
