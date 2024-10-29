import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "../pages/home";
import ProtectedRoute from "./protectedRoute";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";


export default function Router() {


    return (
        <>
            <Routes>
                <Route path="/" element={<ProtectedRoute Component={Homepage} />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
            </Routes>
        </>
    )
}