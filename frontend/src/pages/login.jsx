import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../components/context";

export default function LoginPage() {
    const context = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(process.env.REACT_APP_LOGIN_URL, {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            console.log("Login successful:", response.data);
            context.setToken(response.data.token);
            window.location.href = '/';
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || "Login failed");
            } else {
                setError("An error occurred during login");
            }
            console.error(err);
        }
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="email"
                    placeholder="Email Address"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-secondary">Submit</button>
                <div className="mt-4">
                    Don’t have an account yet? <Link to='/register'>Register</Link>
                </div>
            </form>
        </div>
    );
}
