import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AddCandidate from "../pages/candidate/AddCandidate";
import LoginForm from "../pages/sign/LoginForm";
import AuthLayout from "../layouts/AuthLayout";
import CandidateListPage from "../pages/candidate/CandidateList";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import CandidateDetails from "../pages/candidate/CandidateDetails";
import EmployeesPage from "../pages/Employee Management/Employee/Employees";
import { EmployeeForm } from "../pages/Employee Management/Employee/AddEditEmployee";
import { EmployeeDetails } from "../pages/Employee Management/Employee/EmployeeDetails";
import { LeaveForm } from "../pages/Employee Management/Leave/AddEditLeave";
import { LeavePage } from "../pages/Employee Management/Leave/Leaves";

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
        <Route
          path="/candidates/candidateDetails"
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
      </Route>
      {/* Redirect all other paths to login */}
      <Route path="/*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
