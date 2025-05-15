import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AddCandidate from "../pages/candidate/AddCandidate";
import LoginForm from "../pages/sign/LoginForm";
import AuthLayout from "../layouts/AuthLayout";
import CandidateListPage from "../pages/candidate/CandidateList";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import CandidateDetails from "../pages/candidate/CandidateDetails";

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
        <Route path="/candidates/candidateDetails" element={<CandidateDetails />} />
      </Route>
      {/* Redirect all other paths to login */}
      <Route path="/*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
