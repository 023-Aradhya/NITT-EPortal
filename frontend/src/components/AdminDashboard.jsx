import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/authContext";
import Sidebar from "./Sidebar";  
import './AdminDashboard.css';


const AdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [activeSection, setActiveSection] = useState("admins"); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/users`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const adminUsers = res.data.filter(user => user.role === "content_admin");
        const studentUsers = res.data.filter(user => user.role === "student");

        setAdmins(adminUsers);
        setStudents(studentUsers);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/users/${userId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAdmins(admins.filter(user => user._id !== userId));
      setStudents(students.filter(user => user._id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />  {/* Sidebar Component */}

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {/* Show Admins Section */}
        {activeSection === "admins" && (
          <section className="user-section">
            <h3>Registered Admins</h3>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.length > 0 ? (
                  admins.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <Link to={`/admin/${user._id}`} className="btn btn-info">View</Link>
                        <button className="btn btn-danger" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No admin users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* Show Students Section */}
        {activeSection === "students" && (
          <section className="user-section">
            <h3>Registered Students</h3>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Courses Enrolled</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.courses ? user.courses.join(", ") : "None"}</td>
                      <td>
                        <Link to={`/user/${user._id}`} className="btn btn-info">View</Link>
                        <button className="btn btn-danger" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
