import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../styles/auth.css";

const RegisterPage = () => {
    const [form, setForm] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setSubmitting(true);
        setMessage("");

        try {
            const response = await axios.post(
                "https://chatgpt-clone-gt6b.onrender.com/api/auth/register",
                {
                    email: form.email.trim(),
                    fullName: {
                        firstName: form.firstName.trim(),
                        lastName: form.lastName.trim(),
                    },
                    password: form.password,
                },
                {
                    withCredentials: true,
                }
            );

            console.log("Registration successful:", response.data);

            navigate("/login");
        } catch (error) {
            setMessage(error.response?.data?.message || "Unable to create your account");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-shell">
                <div className="auth-card">

                    <header className="auth-header">
                        <h2 className="auth-title">
                            Create account
                        </h2>

                        <p className="auth-subtitle">
                            Register to get started
                        </p>
                    </header>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="auth-field">
                            <label className="auth-label">
                                Email
                            </label>

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

                        <div className="auth-row">

                            <div
                                className="auth-field"
                                style={{ flex: 1 }}
                            >
                                <label className="auth-label">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="firstName"
                                    className="auth-input"
                                    placeholder="First name"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div
                                className="auth-field"
                                style={{ flex: 1 }}
                            >
                                <label className="auth-label">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="lastName"
                                    className="auth-input"
                                    placeholder="Last name"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                        <div className="auth-field">
                            <label className="auth-label">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                className="auth-input"
                                placeholder="Create a password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Creating account..."
                                : "Register"}
                        </button>

                        {message && <p className="auth-error" role="alert">{message}</p>}

                    </form>

                    <p className="auth-footer">
                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="auth-link"
                        >
                            Login
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default RegisterPage;