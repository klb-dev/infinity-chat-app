import React, { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { rtdb } from "../firebase";
import useAuth from "../hooks/useAuth";

const TypingIndicator = () => {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const typingRef = ref(rtdb, "typingStatus");

    const unsubscribe = onValue(typingRef, (snapshot) => {
      const data = snapshot.val() || {};
      const active = Object.entries(data)
        .filter(([uid, isTyping]) => uid !== user.uid && isTyping)
        .map(([uid]) => uid);
      setTypingUsers(active);
    });

    return () => unsubscribe();
  }, [user]);

  if (!typingUsers.length) return null;

  return (
    <div style={{ fontStyle: "italic", padding: "0.5rem 1rem" }}>
      {typingUsers.length === 1
        ? `${typingUsers[0]} is typing...`
        : `Several people are typing...`}
    </div>
  );
};

export default TypingIndicator;
