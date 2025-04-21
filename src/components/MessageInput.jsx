// MessageInput.jsx
import React, { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc
} from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.text}33;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border-radius: 1rem;
  border: none;
  outline: none;
  background: ${({ theme }) =>
    theme.background === "#1a1a1a" ? "#2a2a2a" : "#f1f1f1"};
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  margin-left: 0.5rem;
  background-color: ${({ theme }) => theme.highlight};
  border: none;
  color: white;
  border-radius: 1rem;
  padding: 0 1rem;
`;

const MessageInput = ({ userMeta, roomId, recipient }) => {
  const [text, setText] = useState("");
  const { user } = useAuth();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await addDoc(collection(db, "chatRooms", roomId, "messages"), {
        text,
        createdAt: serverTimestamp(),
        uid: user.uid,
        name: userMeta.name,
        avatar: userMeta.avatar
      });

      const roomRef = doc(db, "chatRooms", roomId);
      await setDoc(
        roomRef,
        {
          lastMessage: {
            text,
            timestamp: serverTimestamp(),
            from: user.uid,
            name: userMeta.name
          },
          participants: [user.uid, recipient.uid],
          avatars: {
            [user.uid]: userMeta.avatar,
            [recipient.uid]: recipient.avatar
          }
        },
        { merge: true }
      );

      setText("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <Form onSubmit={sendMessage}>
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
      />
      <Button type="submit">Send</Button>
    </Form>
  );
};

export default MessageInput;
