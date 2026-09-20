import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../styles/auth.css";

const LoginPage = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setMessage("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setSubmitting(true);
        setMessage("");

        try {
            const response = await axios.post(
                "https://chatgpt-clone-3akp.onrender.com/api/auth/login",
                {
                    email: form.email.trim(),
                    password: form.password,
                },
                {
                    withCredentials: true,
                }
            );

            console.log("Login successful:", response.data);

            setMessage("Login successful");

            setTimeout(() => {
                navigate("/");
            }, 500);
        } catch (error) {
            console.error("Login error:", error);
            console.log("Status:", error.response?.status);
            console.log("Backend response:", error.response?.data);

            setMessage(
                error.response?.data?.message ||
                "Invalid email or password"
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-shell">
                <div className="auth-card">
                    <header className="auth-header">
                        <h2 className="auth-title">Welcome back</h2>
                        <p className="auth-subtitle">Login to continue</p>
                    </header>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label className="auth-label">Email</label>

                            <input
                                type="email"
                                name="email"
                                className="auth-input"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label className="auth-label">Password</label>

                            <input
                                type="password"
                                name="password"
                                className="auth-input"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {message && (
                            <p
                                style={{
                                    textAlign: "center",
                                    margin: "10px 0",
                                    color:
                                        message === "Login successful"
                                            ? "green"
                                            : "red",
                                }}
                            >
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={submitting}
                        >
                            {submitting ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account?{" "}
                        <Link to="/register" className="auth-link">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;