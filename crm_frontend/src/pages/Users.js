import React, { useState } from "react";
import axios from 'axios';
// import { loginUser } from "../api";
import { withRouter } from "react-router-dom";
//import { response } from "../../../CRM_Backend/app";





// component to Logout user
export function Logout() {
  
  // remove token from the local storage
  sessionStorage.removeItem('token');
  // open the homepage --- example of how to redirect
  // another example
  
  
}

/*
  Generate a login form
*/
export function LoginForm({history}) {
  // state hook functions   
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (sessionStorage.getItem("isAuthenticated") === "true"){
    history.push('./')
  }

  // const token = localStorage.getItem("token");
  // if (token !== null) {
  //     return (
  //         <div>You are logged in</div>
  //     )
  
  
  // submit form
  function onSubmit(e) {
    e.preventDefault();
    // using API function to submit data to Personal CRM API
    // loginUser({
    //     email: email,
    //     password: password
    // });
    axios({
      method: "POST",
      data: {
        email: email,
        password: password
      },
      withCredentials: true,
      url: "http://localhost:5000/login"
    }).then((response) => {
      console.log(response)
      if (response.data){
        sessionStorage.setItem("isAuthenticated", "true")
        console.log('successful login');
        history.push('/')
      } 
      else {
        alert('Wrong email or password');
      }
    }).catch(error => {
      console.log('server error');
      console.log(error);
    })

    
  }
  return (
      <div>
          <h1>CUSTOMER LOGIN</h1>
          <form method= "post" action="/login">
              <input
                  type="text"
                  name="email"
                  id="email"                
                  value={email}
                  placeholder="email"  
                  onChange={event => {
                    setEmail(event.target.value);
                  }}                  
              />
              <input
                  type="password"
                  name="password"
                  id="password"                
                  value={password}
                  placeholder="************"
                  onChange={event => {
                    setPassword(event.target.value);
                  }}                      
              />
              <input type="submit" value="Login" onClick={onSubmit}/>
          </form>
          <a href = "/register">
            <button>Register</button>
          </a>
      </div>
      
  );
}