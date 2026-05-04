import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import './SignUp.css';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const SignUp = () => {
  const { setToken, token, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/api/user/register", { name, email, password });
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success("Account created successfully!");
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
    <div className="signup-page">
      <div className="signup-container">
        {/* Left Side: Form */}
        <div className="signup-form-side">
          <div className="form-wrapper">
            <h1 className="signup-logo-text">VOGUE ECHO</h1>
            <p className="signup-desc">
              Join our exclusive circle of curators. Create an account to access our seasonal collections 
              and bespoke editorial content.
            </p>

            <form className="signup-form" onSubmit={onSubmitHandler}>
              <div className="input-group">
                <label>FULL NAME</label>
                <input 
                  onChange={(e) => setName(e.target.value)} 
                  value={name} 
                  type="text" 
                  placeholder="ALEXANDER VOGUE" 
                  required 
                />
              </div>

              <div className="input-group">
                <label>EMAIL ADDRESS</label>
                <input 
                  onChange={(e) => setEmail(e.target.value)} 
                  value={email} 
                  type="email" 
                  placeholder="CURATOR@VOGUEECHO.COM" 
                  required 
                />
              </div>

              <div className="input-group">
                <label>PASSWORD</label>
                <input 
                  onChange={(e) => setPassword(e.target.value)} 
                  value={password} 
                  type="password" 
                  placeholder="........" 
                  required 
                />
              </div>

              <div className="checkbox-group">
                <input type="checkbox" id="newsletter" defaultChecked />
                <label htmlFor="newsletter">
                  Subscribe to our newsletter for exclusive digital issues and early access to collections.
                </label>
              </div>

              <button type="submit" className="btn-signup-submit">CREATE ACCOUNT</button>
            </form>

            <p className="login-link-text">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>

            <div className="signup-footer-terms">
              <p>
                BY SIGNING UP, YOU AGREE TO OUR TERMS OF SERVICE AND PRIVACY POLICY. 
                VOGUE ECHO ENSURES THE HIGHEST LEVEL OF DATA PROTECTION FOR OUR MEMBERS.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Image Content */}
        <div className="signup-image-side" style={{ backgroundImage: `url(${assets.about_us})` }}>
          <div className="image-overlay-content">
            <button onClick={() => navigate("/")} className="back-btn">✕ BACK TO BOUTIQUE</button>
            <div className="bottom-text">
              <h3>ESTABLISHED IN CURATION</h3>
              <p>
                VOGUE ECHO represents the intersection of timeless craftsmanship and contemporary digital expression.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
