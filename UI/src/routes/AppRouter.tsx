import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AddCandidate from "../pages/candidate/AddCandidate";
import LoginForm from "../pages/sign/LoginForm";
import AuthLayout from "../layouts/AuthLayout";
import CandidateListPage from "../pages/candidate/CandidateList";

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
      <Route path="/candidates" element={<CandidateListPage />} />
      <Route path="/add-candidate" element={<AddCandidate />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
