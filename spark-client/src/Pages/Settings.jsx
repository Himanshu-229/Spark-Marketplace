import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import logo from "../assets/sparkIcon.svg";
import "./Home.css";
import "./Settings.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Greet from "../components/Greet";
import SearchComponent from "../components/Search";
import Dashboardss from "../assets/images/dashboard";
import LinkImage from "../assets/images/LinkImage";
import SettingImage from "../assets/images/SettingImage";
import AnalyticsImage from "../assets/images/AnalyticsImage";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDeletedownVisible, setIsDeletedownVisible] = useState(false);
  const [user, setUser] = useState(null);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const toggleDeletedown = () => {
    setIsDeletedownVisible(!isDeletedownVisible);
  };

  const getSidebarItemClass = (path) => {
    return location.pathname === path ? "sidebar-item active" : "sidebar-item";
  };

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      Toastify({ text: "Logged out successfully" }).showToast();
      navigate("/login");
    }
    console.log("Logout clicked");
  };

  const fetchUserName = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setUser(response.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateDetails = async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;

    const currentEmail = user?.email; // Store the current email for comparison

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update`,
        {
          username,
          email,
          mobile,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        Toastify({
          text: "Profile updated successfully",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#4CAF50",
        }).showToast();

        // If the email has changed, log out the user
        if (email !== currentEmail) {
          Toastify({
            text: "Email updated. Please log in again.",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#FF5733",
          }).showToast();

          localStorage.removeItem("token"); // Remove the token
          navigate("/login"); // Redirect to login
        } else {
          fetchUserName(); // Refresh user details if email hasn't changed
        }
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      Toastify({
        text: "Failed to update profile. Please try again.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF5733",
      }).showToast();
    }
  };

  const deleteProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/delete`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status === 200) {
        Toastify({ text: "Profile Deleted successfully" }).showToast();
        fetchUserName();
        localStorage.removeItem("token");
        navigate("/Signup");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  return (
    <div className="mainbody">
      <div className="vr"></div>
      <div className="sidebar">
        <div className="sidebar-items-container">
        <div className="logo-dashboard">
        <span><img src={logo} alt="" /></span>
        <span>Spark</span>
     
        </div>
          <div className="sidebar-items">
            <Link to="/home" className={getSidebarItemClass("/home")}>
              <Dashboardss />

              <h3 className="texts">Dashboard</h3>
            </Link>

            <Link to="/links" className={getSidebarItemClass("/links")}>
              <LinkImage />
              <h3 className="texts">Links</h3>
            </Link>
            <Link to="/analytics" className={getSidebarItemClass("/analytics")}>
              <AnalyticsImage />
              <h3 className="texts">Analytics</h3>
            </Link>
            <Link to="/settings" className={getSidebarItemClass("/settings")}>
              <SettingImage />
              <h3 className="texts">Settings</h3>
            </Link>
          </div>
          
          <div className="profilecont">
            <div className="profile" onClick={toggleDropdown}>
              <div className="profile">
            <span>
                <img style={{width:"30px",height:"30px",backgroundColor:"gray", borderRadius:"50%", marginRight:"8px"}}  src="" alt="" /></span>
              <p style={{margin:"4px"}}>{user ? user.username : ""}</p>
        </div>
            </div>
            {isDropdownVisible && (
              <div className="profile-dropdown">
                <button
                  className="logout"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="navbar">
        <div className="searchbar">
          <div>
            <Greet />
          </div>
          
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <form className="settings-form">
            <div className="settings-container">
              <div><label className="settingname">Name</label></div>
              <input
                type="text"
                id="username"
                name="username"
                defaultValue={user ? user.username : ""}
                placeholder="Enter your name"
              />
            </div>
            <div className="settings-container">
              <div><label className="settingname">Email Id</label></div>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={user ? user.email : ""}
                placeholder="Enter your email id"
              />
            </div>
            <div className="settings-container">
              <div>
              <label className="settingname">Mobile no.</label></div>
              <input
                type="text"
                id="mobile"
                name="mobile"
                defaultValue={user ? user.mobile : ""}
                placeholder="Enter your mobile number"
              />
            </div>
            <div className="btn-container">
              <button className="save-btn" onClick={updateDetails}>
                Save Changes
              </button>
          
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
