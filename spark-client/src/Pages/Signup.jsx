import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import sparkIcon from "../assets/sparkIcon.svg";
import frame from "../assets/Frame.png";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState("");
  
  const [isValid, setIsValid] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  useEffect(() => {
    if (password !== confirmpass) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  }, [password, confirmpass]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUser = { username, email, mobile, password };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
        newUser
      );

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        Toastify({
          text: "User created successfully",
        }).showToast();
        navigate("/Login");
      }
    } catch (error) {
      if (error.response) {
        Toastify({
          text: error.response.data.message || "Something went wrong!",
        }).showToast();
      } else if (error.request) {
        Toastify({
          text: "No response from the server. Please try again later.",
        }).showToast();
      } else {
        Toastify({ text: "An error occurred: " + error.message }).showToast();
      }
    }

    setUsername("");
    setEmail("");
    setMobile("");
    setPassword("");
    setConfirmpass("");
  };

  const getBorderColor = () => {
    if (!confirmpass) return "black";
    return password === confirmpass ? "green" : "red";
  };
  return (
    <div className="signup-container">
    <div style={{ display: "flex", justifyContent: "center", marginLeft: "30px", width: "10%" }}>
      <div style={{ display: "flex" }}>
        <img style={{ width: "32px", height: "32px", padding: "20px 5px" }} src={sparkIcon} alt="spark icon" />
        <h2>Spark</h2>
      </div>
    </div>

    <div style={{ width: "60%", padding: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form className="signup-form"  onSubmit={submitHandler} noValidate>
        <h1>Sign up to your <span className="highlight">Spark</span></h1>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p>Create an account</p>
          <span 
            style={{ color: "#28A263", textDecoration: "underline", cursor: "pointer" }} 
            onClick={() => navigate('/login')}
          >
            Sign in instead
          </span>
        </div>

        <input
           required
           value={username}
           onChange={(e) => setUsername(e.target.value)}
           type="text"
           placeholder="Name"
           minLength={3}
          style={{ borderColor: error.Name ? "red" : "gray" }}
        />
      {error.username && (
      <span style={{ color: "red", fontSize: "10px", margin: "-6px 0px" }}>
          {error.username}
      </span>
      )}

        <input
           required
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           type="email"
           placeholder="Email Id."
           minLength={6}
          style={{ borderColor: error.email ? "red" : "gray" }}
        />
        
           {error.email && (
          <span style={{ color: "red", fontSize: "10px", margin: "-6px 0px" }}>
              {error.email}
          </span>
          )}

        <input
           placeholder="Mobile No."
           value={mobile}
           onChange={(e) => {
             setMobile(e.target.value);
           }}
          style={{ borderColor: error.mobile ? "red" : "gray" }}
        />
      {error.mobile && (
      <span style={{ color: "red", fontSize: "10px", margin: "-6px 0px" }}>
          {error.mobile}
      </span>
      )}

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);}}
          style={{ borderColor: getBorderColor() }}
          placeholder="Password"
        />
      {error.password && (
      <span style={{ color: "red", fontSize: "10px", margin: "-6px 0px" }}>
          {error.password}
      </span>
      )}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          style={{ borderColor: getBorderColor() }}
          value={confirmpass}
          onChange={(e) => {
            setConfirmpass(e.target.value);}}
        />
          {error.confirmpass && (
          <span style={{ color: "red", fontSize: "10px", margin: "-6px 0px" }}>
              {error.confirmpass}
          </span>
          )}

        <div className="terms">
          <input
            type="checkbox"
            id="terms"
            name="agreeToTerms"
          />
          <label htmlFor="terms">
            By creating an account, I agree to our <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>
          </label>
        </div>
              {error.agreeToTerms && (
              <span style={{ color: "red", fontSize: "10px", margin: "-6px 0px" }}>
                  {error.agreeToTerms}
              </span>
              )}

        <button
          type="submit"
          className="signup-button"
          style={{
            marginTop: "15px",
            backgroundColor: "#28A263" ,
            cursor:  "pointer" ,
          }}
        >
          Create an account
        </button>
      </form>
    </div>

    <div className="signup-image">
      <img style={{ height: "100vh", width: "100%" }} src={frame} alt="frame" />
    </div>
  </div>
  );
};

export default Signup;
