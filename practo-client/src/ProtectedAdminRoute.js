import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "ROLE_ADMIN") {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8080/admin/verify", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        setAuthorized(true);
      })
      .catch(() => {
        localStorage.removeItem("user");
        navigate("/login");
      })
      .finally(() => setChecking(false));
  }, [navigate]);

  if (checking) return <div>Checking authentication...</div>;

  return authorized ? <Outlet /> : null;
};

export default ProtectedAdminRoute;
