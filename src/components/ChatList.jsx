// ChatList.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import styled from "styled-components";

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

const ChatCard = styled.button`
  background: ${({ theme }) => theme.background === "#1a1a1a" ? "#2a2a2a" : "#fff"};
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.accent};
    color: white;
  }

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }

  .meta {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .meta small {
    opacity: 0.65;
    font-size: 0.8rem;
  }
`;

const ChatList = ({ currentUser, onSelectChat }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const loadChats = async () => {
      const ref = collection(db, "chatRooms");
      const q = query(ref, where("participants", "array-contains", currentUser.uid));
      const snapshot = await getDocs(q);

      const list = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(room => room.lastMessage)
        .sort((a, b) => b.lastMessage.timestamp?.seconds - a.lastMessage.timestamp?.seconds);

      setRooms(list);
    };

    loadChats();
  }, [currentUser.uid]);

  return (
    <List>
      {rooms.map((room) => {
        const otherUid = room.participants.find(uid => uid !== currentUser.uid);
        const last = room.lastMessage;
        const avatar = room.avatars?.[otherUid] || "/placeholder.png";

        return (
          <ChatCard key={room.id} onClick={() => onSelectChat({ uid: otherUid })}>
            <img src={avatar} alt="avatar" />
            <div className="meta">
              <strong>{last.name}</strong>
              <small>{last.text}</small>
            </div>
          </ChatCard>
        );
      })}
    </List>
  );
};

export default ChatList;