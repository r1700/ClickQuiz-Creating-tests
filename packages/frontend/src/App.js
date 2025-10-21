import './App.css';
import CreateExamMain from './component/createExam/CreateExam';
import EditExam from './component/createExam/EditExam';
import ExportExam from './component/createExam/ExportExam';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from './component/login/Login';
import Register from './component/login/Register';
import React from 'react';
import ForgetPassword from './component/login/ForgetPassword';
import ResetPassword from './component/login/resetPassword';
import MyTestsList from './component/GetMyTests';


function PrivateRoute({ children }) {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>טוען...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
      {/* <CreateExamMain/>/ */}
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-exam" element={<CreateExamMain />} />
            <Route path="/export-exam/:id" element={<ExportExam />} />
            <Route path="/edit-exam/:examId" element={<EditExam />} />
            <Route path="/get-my-exams" element={<MyTestsList />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/" element={<PrivateRoute><CreateExamMain /></PrivateRoute>} />

          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
