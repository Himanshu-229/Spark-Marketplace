import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Greet.css";

const Greet = () => {
  const [name, setName] = useState("");

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
        const fetchedName = response.data.data.username;
        setName(fetchedName);
      }
    } catch (err) {
      setError("Failed to load name");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  
  return (
    <div className="greetcontainer">
      <div className="greet">
        <span
          className="user-avatar"
          style={{ fontSize: "2rem", marginLeft: "10px" }}
        >
          {/* {avatarUrl} Emoji avatar */}
        </span>
        <div>
          <h1 className="headings">
           Hi {name} !
          </h1>
          <p className="date">Congratulations . You got a great response today .</p>
        </div>
      </div>
    </div>
  );
};

export default Greet;
