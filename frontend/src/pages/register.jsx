import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(process.env.REACT_APP_REGISTER_URL, {
                email,
                password,
            });

            console.log("Registration successful:", response.data);

            navigate("/login");
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || "Registration failed");
            } else {
                setError("An error occurred during registration");
            }
            console.error(err);
        }
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Create profile</h2>
                <input
                    type="email"
                    placeholder="Email address"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary">Submit</button>
                {error && <p className="error-message">{error}</p>}
                <div className="mt-4">
                    Already have an account? <Link to='/login/'>Login</Link>
                </div>
            </form>
        </div>
    );
}
