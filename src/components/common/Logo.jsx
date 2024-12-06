import React from "react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Logo = ({ onLogoClick, style }) => {
  const navigate = useNavigate();

  // Determine the dashboard based on the userRole
  const handleLogoClick = () => {
    const role = localStorage.getItem("userRole");
    if (role === "seller") {
      navigate("/seller-dashboard");
    } else if (role === "buyer") {
      navigate("/buyer-dashboard");
    }
  };

  // Ensure the logo is clickable only if the user has chosen a role
  const canClickLogo = localStorage.getItem("userRole");

  return (
    <div className="d-flex flex-column align-items-center">
      <img
        src={logo}
        alt="CampusMart Logo"
        style={{
          maxHeight: "100px",
          width: "auto",
          marginTop: "30px",
          ...(style || {}),
          cursor: canClickLogo ? "pointer" : "default", // Change cursor based on the role
        }}
        onClick={canClickLogo ? handleLogoClick : null} // Only clickable if userRole is set
      />
      <h1 className="text-primary mt-3">CampusMart</h1>
    </div>
  );
};

export default Logo;
