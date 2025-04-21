// ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import styled from "styled-components";
import MessageBubble from "./MessageBubble";

const Wrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const ChatWindow = ({ userMeta, currentUid, roomId }) => {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef();

  useEffect(() => {
    if (!roomId) return;
    const messagesRef = collection(db, "chatRooms", roomId, "messages");
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Wrapper>
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.uid === currentUid}
          userMeta={userMeta}
          currentUid={currentUid}
          roomId={roomId}
        />
      ))}
      <div ref={bottomRef} />
    </Wrapper>
  );
};

export default ChatWindow;
