import React, { useState } from "react";
import "../App.css";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

 

export default function Mainpage({ toast, signIn, user }) {
  const [users, setUsers] = useState({ userName: "", email: "", password: "" });
  const [userLogin, setUserLogin] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const openForgotPass = () => {
    navigate("/forgotpass");
  };

  function handleOnchange(e) {
    setUsers({
      ...users,
      [e.target.name]: e.target.value,
    });
  }

  function handleUserLogin(e) {
    setUserLogin({
      ...userLogin,
      [e.target.name]: e.target.value,
    });
  }
  axios.defaults.withCredentials = true;
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (userLogin.email === "" || userLogin.password === "") {
      toast.error("Enter the details");
      return;
    }
    axios
      .post(`${API_URL}/login`, userLogin)
      .then((result) => {
        console.log(result);
        if (result.data.success) {
          toast.success("Login successfully");
         
          navigate("/Home");
        } else {
          toast.error("Enter the correct details");
          setUserLogin({ email: "", password: "" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setUserLogin({ email: "", password: "" });
  };

  
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!users.userName || !users.email || !users.password) {
      toast.error("All fields are required");
      return;
    }
  
    try {
      const response = await axios.post(`${API_URL}/register`, users);
      console.log(response);
      if (response.data.success) {
        toast.success("Registered Successfully!");
        setUsers({ userName: "", email: "", password: "" });
        signIn(); 
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Try again.");
    }
  };
  
  

  return (
    <>
      <div className="form-container sign-up">
        <form method="POST" action="/" onSubmit={handleRegister}>
          <h1>Create Account</h1>
          
          <span>use your email for registration</span>
          <input
            type="text"
            placeholder="Username"
            id="userName"
            name="userName"
            value={users.userName}
            onChange={handleOnchange}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            value={users.email}
            onChange={handleOnchange}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            name="password"
            value={users.password}
            onChange={handleOnchange}
            autocomplete="current-password"
          />
          <button className="bt" type="submit">
            Sign Up
          </button>
        </form>
      </div>

      <div className="form-container sign-in">
        <form method="POST" action="/" onSubmit={handleLogin}>
          <h1>Sign In</h1>

          
          <span>use your email and password</span>
          <input
            type="email"
            name="email"
            value={userLogin.email}
            onChange={handleUserLogin}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={userLogin.password}
            onChange={handleUserLogin}
            placeholder="Password"
            autocomplete="current-password"
          />
          <a onClick={openForgotPass} href="/forgotpass">
            Forget your password?
          </a>
          <button className="bt" type="submit">
            Sign In
          </button>
          <br />

        </form>
      </div>

       
    </>
  );
}
