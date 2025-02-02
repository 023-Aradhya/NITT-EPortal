import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../context/authContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student"); // New state for role
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setCurrentUser } = useAuth(); // Use authentication context

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:3001/login', { email, password });

            // Check if token, userId, and role are present in the response
            const { token, userId, role: userRole } = res.data;

            // Check if the user is trying to log in as a different role
            if (role !== userRole) {
                alert('You cannot log in as a different role. Please check your role.');
                return;
            }

            if (token && userId) {
                console.log("Login Successful");

                // Store userId, token, and role in localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("userId", userId);
                localStorage.setItem("role", userRole);  // Store role in localStorage

                // Update auth context
                setCurrentUser(userId);

                // Navigate to the dashboard or home page based on role
                if (userRole === "admin") {
                    navigate('/Admindashboard');  // Redirect to admin dashboard
                } else {
                    navigate('/home');  // Redirect to home for students
                }
            } else {
                alert('Incorrect password or email! Please try again.');
            }
        } catch (err) {
            console.error("Login Error:", err);
            alert(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center text-center vh-100"
                 style={{marginTop: "80px", background: "url('https://media.istockphoto.com/id/1365169514/video/learning-from-books-or-textbooks-and-the-internet-helps-create-new-ideas-slowly-moving.jpg?s=640x640&k=20&c=boT0zUPwwEHuIS-LXCbBdsx8D2KgtBLi_gNY2KR1bSA=') center/cover no-repeat, linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3))" }}>
                <div className="bg-light p-3 rounded" style={{ width: '35%', marginLeft: '-35%' }}>
                    <h2 className="mb-3 text-primary">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                                <strong>Email Id</strong>
                            </label>
                            <input 
                                type="email" 
                                placeholder="Enter Email"
                                className="form-control" 
                                id="exampleInputEmail1" 
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            /> 
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputPassword1" className="form-label">
                                <strong>Password</strong>
                            </label>
                            <input 
                                type="password" 
                                placeholder="Enter Password"
                                className="form-control" 
                                id="exampleInputPassword1" 
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>

                        {/* Role Selection Dropdown */}
                        <div className="mb-3 text-start">
                            <label htmlFor="role" className="form-label">
                                <strong>Select Role</strong>
                            </label>
                            <select 
                                id="role" 
                                className="form-control" 
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                                required
                            >
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button disabled={loading} type="submit" className="btn btn-primary">
                            {loading ? "Loading..." : "Login"}
                        </button>
                    </form>
                    <p className="container my-2">Don&apos;t have an account?</p>
                    <Link to="/register" className="btn btn-secondary">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
