import React from "react";
import { useState } from "react";
import "./Signup.css";
import {useHistory} from 'react-router-dom';
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
//import axios from 'axios';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cookies, setCookie] = useCookies(['user']);
  const [cart, setCart, removeCart] = useCookies(['cart']) //cookies stuff
  const history = useHistory();

  const setUserCookies = () => {
    //sets cookie to have the username
    setCookie('userName', username, { path: '/' , sameSite: 'strict'});
 };


 async function get_cart(username) {
   console.log("getting cart")
     try {
       console.log("inside")
       const body = { name: username };
       const response = await fetch("/get_cart", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(body),
       });
       // console.log(response)
       const data = await response.json();
       console.log("get cart from server", data.cart_json)
       setCart('cart', data.cart_json, { path: '/' , sameSite: 'strict'});
     } catch (err) {
       console.error(err.message);
     }
 };

  //below function will be activated when login form submitted,
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const body = { username, password};
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if(data.message === "Login Successful!"){
        setUserCookies() ;
        history.push('/shop'); //If login successful, page will log in and open the /shop
        //Later I may want to incorporate cookies upon login
        //can set cookies here
        setUserCookies() ;
        removeCart('cart');
        get_cart(username);
      }
      else{
        setError(data.message); //Will set the error message to the msg in data
      }
      console.log(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
      <body class="login_body">
        <div class="signup-form">
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <p class="hint-text">Login to buy books.</p>

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
                <button type="submit" class="btn btn-success btn-lg btn-block">
                  Login Now
                </button>
            </div>
            {/*The below line is the error msg for when login unsuccessful */}
            {(error !== "") ? ( <div class="error">{error}</div>) : ""}
          </form>
          <div class="text-center">
            Don't have account yet? <Link to="/signup">Create an account</Link>
          </div>
        </div>
      </body>
    </div>
  );
}

export default Login;
