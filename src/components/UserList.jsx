// UserList.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import styled from "styled-components";

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.text}22;
`;

const UserCard = styled.button`
  background: ${({ theme }) =>
    theme.background === "#1a1a1a" ? "#333" : theme.card};
  color: ${({ theme }) =>
    theme.background === "#1a1a1a" ? "#fff" : theme.text};
  border: none;
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: 0.2s ease all;

  &:hover {
    background: ${({ theme }) => theme.accent};
    color: white;
  }

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
`;

const UserList = ({ currentUser, onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs
        .map(doc => ({ uid: doc.id, ...doc.data() }))
        .filter(user => user.uid !== currentUser.uid);
      setUsers(userList);
    };

    loadUsers();
  }, [currentUser.uid]);

  return (
    <List>
      {users.map((user) => (
        <UserCard key={user.uid} onClick={() => onSelectUser(user)}>
          <img src={user.avatar} alt={user.name} />
          {user.name}
        </UserCard>
      ))}
    </List>
  );
};

export default UserList;
