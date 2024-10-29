import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "./context";



export default function ProtectedRoute(props) {

    const context = useContext(Context);
    const { Component } = props;

    return (
        <>
            {context.token ? <Component /> : <Navigate to='/login/' />   }            
        </>
    )
};