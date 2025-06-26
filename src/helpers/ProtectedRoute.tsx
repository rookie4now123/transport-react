import React from "react";
import { Navigate, Outlet } from "react-router";
import { getUser } from "../hooks/useractions";
function ProtectedRoute() {
  const user = getUser();
  return user ? <Outlet /> : <Navigate to="/" replace/>;
}

export default ProtectedRoute;