import './App.css';
import CreateExamMain from './component/createExam/CreateExam';
import EditExam from './component/createExam/EditExam';
import ExportExam from './component/exportExem/ExportExam'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from './component/login/Login';
import Register from './component/login/Register';
import React from 'react';
import ForgetPassword from './component/login/ForgetPassword';
import ResetPassword from './component/login/resetPassword';
import MyTestsList from './component/GetMyTests';
import HomePage from './component/HomePage';
// import Sidebar from './component/SideBar';
// import HomePage222 from './component/HomePage copy';
import HomePageAnimated from './component/HomePage copy';
import NavBar from './component/NavBar';
import usePageTitle from './hooks/usePageTitle';
import Footer from './component/Footer';
import { Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        h3: { fontSize: { xs: "1.8rem", md: "3rem" } },
        h4: { fontSize: { xs: "1.4rem", md: "2.125rem" } },
        h5: { fontSize: { xs: "1.1rem", md: "1.5rem" } },
        h6: { fontSize: { xs: "1rem", md: "1.25rem" } },
    },
});

function PrivateRoute({ children }) {
  const { user, isLoggedIn, loading } = React.useContext(AuthContext);

  if (loading) return <div>טוען...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  //  usePageTitle();
  return (
    <>
    
      <AuthProvider>
        <Router>
          {/* <Sidebar /> */}
          <PageTitleHandler />

          <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#F6F9FB", pt: "120px" }}>
            <NavBar />

            <Box sx={{ flex: 1,px: 2  }}>
              <Routes>
                <Route path="/" element={<HomePageAnimated />} />
                <Route path="/home" element={<HomePage />} />
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
            </Box>

            <Footer />
          </Box>

        </Router>

      </AuthProvider>
    </>
  );
}

// קומפוננטה פנימית שמופעלת בתוך ה־Router
function PageTitleHandler() {
  usePageTitle();
  return null;
}

export default App;
