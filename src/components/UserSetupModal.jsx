import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  max-width: 400px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.text}33;
  background: ${({ theme }) => theme.background === '#1a1a1a' ? "#2a2a2a" : "#f1f1f1"};
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  margin-top: 1rem;
  width: 100%;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
`;

const UserSetupModal = ({ onComplete }) => {
  const { user } = useAuth();
  const [name, setName] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        onComplete(docSnap.data());
      }
    };
    if (user) checkUser();
  }, [user, onComplete]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      console.warn("Name is empty, not submitting.");
      return;
    }
  
    const avatar = `https://robohash.org/${user.uid}?set=set5`;
    const userData = { name, avatar };
  
    try {
      console.log("Saving user:", userData);
      await setDoc(doc(db, "users", user.uid), userData);
      onComplete(userData);
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };
  

  return (
    <Overlay>
      <Modal>
        <h2>Choose a Nickname</h2>
        <Input
          placeholder="Your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleSubmit}>Continue</Button>
      </Modal>
    </Overlay>
  );
};

export default UserSetupModal;
