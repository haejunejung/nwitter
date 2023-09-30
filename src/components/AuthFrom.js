import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../fire-base";

const AuthForm = ({ newAccount }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        // create account
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // login
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        name="email"
        type="email"
        placeholder="email"
        required
        value={email}
        onChange={onChange}
      ></input>
      <input
        name="password"
        type="password"
        placeholder="password"
        required
        value={password}
        onChange={onChange}
      ></input>
      <input
        type="submit"
        value={newAccount ? "Create Account" : "login"}
      ></input>
      {error}
    </form>
  );
};

export default AuthForm;
