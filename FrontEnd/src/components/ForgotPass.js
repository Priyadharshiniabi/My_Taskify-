import React, { useState } from "react";
import "./styles/forgotpass.css";
import axios from "axios";

const ForgotPass = ({ toast }) => {
  const [email, setEmail] = useState("");
  axios.defaults.withCredentials = true;
  const getNewPassLink = async (e) => {
    if (!email) {
      toast.error("Please enter your registered email");
      return;
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/forgotpass`, { email });

      if (res.data.Status === "success") {
        toast.success("Check your email for the reset link");
      } else {
        toast.error(res.data.message || "Enter the registered email");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <form>
      <div className="forgot-con">
        <h3>Forgot Your password?</h3>
        <h3>Just relax!</h3>
        <label htmlFor="email">Enter your registered email</label>
        <input
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder=" Email"
        />
        <button onClick={getNewPassLink}>submit</button>
      </div>
    </form>
  );
};

export default ForgotPass;
