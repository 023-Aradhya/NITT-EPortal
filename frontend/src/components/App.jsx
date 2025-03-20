import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/authContext";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Courses from "./courses";
import DataScience from "./DataScience";
import ContentAdmin from "./ContentAdmin";
import ContentAdminForm from "./contentAdminForm"; 
import ContentAdminDescription from "./ContentAdminDescription"; 
import Contact from "./Contact";
import About from "./About";
import NewCourse from "./NewCourse";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import StudentDetails from "./StudentDetails";
import AdminDetails from "./AdminDetails"; 
import ApplicationForm from "./ApplicationForm";


function App() {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromStorage && !currentUser) {
      setCurrentUser({ userId: userIdFromStorage });
    }

    if (!userIdFromStorage) {
      // Allow unauthenticated users to access only login & register pages
      if (!["/login", "/register"].includes(window.location.pathname)) {
        navigate("/login"); // Redirect to login instead of register
      }
    }
  }, [currentUser, navigate, setCurrentUser]);

  return (
    <div style={{ marginTop: "-3.5rem" }}>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/datascience" element={<DataScience />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/add-course" element={<NewCourse />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Admindashboard" element={<AdminDashboard />} />
          <Route path="/content-admin" element={<ContentAdmin />} />
          <Route path="/user/:id" element={<StudentDetails />} />
          <Route path="/admin/:id" element={<AdminDetails />} />
          <Route path="/ApplicationForm" element={<ApplicationForm />} />
          {/* New Routes for Content Admin Actions */}
          <Route path="/content-admin/add-form/:courseId" element={<ContentAdminForm />} />
          <Route path="/content-admin/add-description/:courseId" element={<ContentAdminDescription />} />
        </Routes>
        <Footer />
      </>
    </div>
  );
}

export default App;

