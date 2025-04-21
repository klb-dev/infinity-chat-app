import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously
} from "firebase/auth";
import { auth } from "../firebase";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  width: 100%;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  width: 100%;
  margin-top: 0.5rem;
`;

const Toggle = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  color: ${({ theme }) => theme.accent};
`;

const AuthForm = ({ onAuthSuccess }) => {
  const [step, setStep] = useState("choose"); // choose | form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = isLogin
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);
      onAuthSuccess(userCredential.user);
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      onAuthSuccess(userCredential.user);
    } catch (err) {
      console.error("Guest login error:", err);
      setError(err.message);
    }
  };

  // Step 1: Let the user choose
  if (step === "choose") {
    return (
      <Container>
        <h2>Welcome to the Chat</h2>
        <Button onClick={() => setStep("form")}>Sign in / Register</Button>
        <Button onClick={handleGuestLogin}>Continue as Guest</Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Container>
    );
  }

  // Step 2: Show email login form
  return (
    <Container>
      <h2>{isLogin ? "Sign In" : "Create Account"}</h2>
      <form onSubmit={handleEmailAuth} style={{ width: "100%", maxWidth: "400px" }}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button type="submit">{isLogin ? "Sign In" : "Sign Up"}</Button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Toggle onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
      </Toggle>
    </Container>
  );
};

export default AuthForm;
