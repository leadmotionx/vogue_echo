import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import "./Login.css";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { setToken, token, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/api/user/login", { email, password });
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success("Welcome back, " + response.data.name);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="login-page">
      <div className="container">
        {/* Top Logo Section */}
        <div className="login-logo-header">
          <img src={assets.logo} alt="Vogue Echo" />
        </div>

        <div className="login-main-content">
          <div className="login-layout">
            {/* Left: Sign In Form */}
            <div className="sign-in-column">
              <h2>Sign In</h2>
              <p className="login-subtitle">
                Access your editorial curation and orders.
              </p>

              <form className="login-form" onSubmit={onSubmitHandler}>
                <div className="input-group">
                  <label>EMAIL ADDRESS</label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="customer@vogueecho.com"
                    required
                  />
                </div>

                <div className="input-group">
                  <div className="label-row">
                    <label>PASSWORD</label>
                  </div>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="........"
                    required
                  />
                </div>
                <Link to="/forgot-password" style={{ display: 'none' }} className="forgot-pwd">
                  Forgot Password?
                </Link>

                <button type="submit" className="btn-login-submit">
                  SIGN IN <span className="arrow">→</span>
                </button>
              </form>
            </div>

            {/* Right: Create Account Info */}
            <div className="create-account-column">
              <div className="info-box">
                <h3>Create an Account</h3>
                <p>
                  Join the Vogue Echo inner circle. Enjoy personalized styling,
                  early access to new collections, and a seamless editorial
                  shopping experience.
                </p>

                <ul className="benefits-list">
                  <li>
                    <span>✓</span> PRIORITY SHIPPING
                  </li>
                  <li>
                    <span>✓</span> EXCLUSIVE EDITORIAL CONTENT
                  </li>
                  <li>
                    <span>✓</span> CURATED RECOMMENDATIONS
                  </li>
                </ul>

                <Link to="/signup" className="btn-outline-create">
                  CREATE ACCOUNT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
