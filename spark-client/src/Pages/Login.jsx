import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import sparkIcon from "../assets/sparkIcon.svg";
import frame from "../assets/Frame.png";

import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const validate = () => {
    let errors = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const login = {
      email,
      password,
    };
    try {
      const responce = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        login
      );
      if (responce.status === 200) {
        const data = responce.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        Toastify({ text: "Login successful" }).showToast();
        navigate("/home");
        //to hide credentials from frontend
        window.location.reload();
      }
    } catch (error) {
      if (error.response) {
        Toastify({
          text: error.response.data.message || "Something went wrong!",
        }).showToast();
      } else if (error.request) {
        // Request made but no response received
        Toastify({
          text: error.request.data.message || "Something went wrong!",
        }).showToast();
      } else {
        // Other errors
        Toastify({ text: `An error occurred: ${error.message}` }).showToast();
      }
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-container" style={{ display: "flex",backgroundColor:"white" }}>
    <div style={{ display: "flex", justifyContent: "center", marginLeft: "30px", width: "10%" }}>
      <div style={{ display: "flex" }}>
        <img style={{ width: "32px", height: "32px", padding: "20px 5px" }} src={sparkIcon} alt="" />
        <h2>Spark</h2>
      </div>
    </div>

    <div style={{ width: "60%", padding: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form action="" className="signup-form" onSubmit={(e) => {
              submitHandler(e);
            }}>
      
        <h1>Log in to your <span className="highlight">Spark</span></h1>
        <p>Don't have an account? <span className="signup-link" onClick={() => navigate('/signup')}>Sign up instead</span></p>
        <input 
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        type="email"
        placeholder="Enter your email"
        minLength={6} 
        style={{ borderColor: error.email ? "red" : "gray" }}
        />
        {error.email && <small style={{ color: "red", margin: "0px" }}>{error.email}</small>}

        <input className="passinput"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
              minLength={6} 
              style={{ borderColor: error.password ? "red" : "gray" }}
              />
              {error.password && <small style={{ color: "red", margin: "0px" }}>{error.password}</small>}
    
        <button className="signup-button" type="submit" style={{ marginTop: "15px" }}
        >Log in</button>
        
        <div style={{color:"#28A263", textDecoration:"underline",cursor:"pointer",marginTop:"10px",textAlign:"center"}}
        >Forgot password?</div>

        <div style={{marginTop:"10px",textAlign:"center"}}
        >
          Don't have an account? <span style={{color:"#28A263", textDecoration:"underline",cursor:"pointer"}} onClick={()=>navigate('/signup')}>Sign up</span>
        </div>
      </form>
      
      
    </div>

   <div className="signup-image"> 
      <img style={{height:"100vh",width:"100%"}} src={frame} alt="" />
    </div>

  </div>
  );
};

export default Login;
