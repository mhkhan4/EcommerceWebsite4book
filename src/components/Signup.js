import React from "react";
import "./Signup.css";
import { useState } from "react";
import Navbar from "./Navbar";
import {useHistory} from 'react-router-dom';
import { Link } from "react-router-dom";



function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setconfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const history = useHistory();
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const body = { username, firstName, lastName, password, confirm_password, email };
      const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const resetPasswordFields = () => {
        setPassword("");
        setconfirmPassword("");
      };
      const data = await response.json();
      //alert(data.message);   data.message might not be string, need convert
      if (data.message === "Sign-Up Successful"){
        history.push('/login');
      } else {
        setError(data.message);
        //Need to reset fields so user can try again.
        resetPasswordFields();
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  return (
    <div>
      <Navbar />
      <body>
        <div class="signup-form">
          <form onSubmit={handleSignup}>
            <h2>Register</h2>
            <p class="hint-text">
              Create your account. It's free and only takes a minute.
            </p>
            <div class="form-group">
              <div class="row">
                <div class="col">
                  {" "}
                  <input
                    type="text"
                    class="form-control"
                    name="first_name"
                    placeholder="First Name"
                    required="required"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div class="col">
                  <input
                    type="text"
                    class="form-control"
                    name="last_name"
                    placeholder="Last Name"
                    required="required"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <input
                type="text"
                class="form-control"
                name="username"
                placeholder="Username"
                required="required"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div class="form-group">
              <input
                type="email"
                class="form-control"
                name="email"
                placeholder="Email"
                required="required"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                name="password"
                placeholder="Password"
                required="required"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control"
                name="confirm_password"
                placeholder="Confirm Password"
                required="required"
                value={confirm_password}
                onChange={(e) => setconfirmPassword(e.target.value)}
              />
            </div>
            <div class="form-group">
              <label class="form-check-label">
                <input type="checkbox" required="required" /> I accept the{" "}
                <a href="#">Terms of Use</a> &amp;{" "}
                <a href="#">Privacy Policy</a>
              </label>
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-success btn-lg btn-block">
                Register Now
              </button>

              {(error !== "") ? ( <div class="error">{error}</div>) : ""}

            </div>
          </form>
          <div class="text-center">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </body>
    </div>
  );
}

export default Signup;
