import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ColocDetailPage from "./pages/ColocDetailPage";
import CreateColocPage from "./pages/CreateColocPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/layout/Layout";
import LoginModal from "./components/auth/LoginModal";
import "./App.css";

const App: React.FC = () => {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coloc/:colocId" element={<ColocDetailPage />} />
          <Route path="/create-coloc" element={<CreateColocPage />} />
            <Route path="/coloc/:colocId/edit" element={<CreateColocPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      <LoginModal />
    </>
  );
};

export default App;
