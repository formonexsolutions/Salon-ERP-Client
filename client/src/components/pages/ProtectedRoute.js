import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Adjust the path as per your directory structure

const ProtectedRoute = () => {
  const { token } = useContext(AuthContext);
  return token ? <Outlet /> : <Navigate to="/Loginpage" />;
};

export default ProtectedRoute;
