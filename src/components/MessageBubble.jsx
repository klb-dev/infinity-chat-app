// src/components/MessageBubble.jsx
import React from "react";
import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  flex-direction: ${({ $isOwn }) => ($isOwn ? "row-reverse" : "row")};
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin: 0 0.5rem;
`;

const Bubble = styled.div`
  max-width: 70%;
  padding: 0.75rem 1rem;
  background-color: ${({ $isOwn, theme }) =>
    $isOwn ? theme.primary : theme.accent};
  color: white;
  border-radius: 1rem;
  border-bottom-${({ $isOwn }) => ($isOwn ? "right" : "left")}-radius: 0.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  word-wrap: break-word;
  position: relative;

  &:hover .reaction-buttons {
    display: flex;
  }
`;

const Name = styled.div`
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  font-weight: bold;
  opacity: 0.85;
`;

const Reactions = styled.div.attrs({ className: "reaction-buttons" })`
  display: none;
  gap: 0.25rem;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const Emoji = styled.button`
  background: ${({ selected }) =>
    selected ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.1)"};
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  color: white;
  outline: none;
  transition: all 0.2s ease;
  transform: ${({ selected }) => (selected ? "scale(1.1)" : "scale(1)")};

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.15);
  }
`;


const ReactionDisplay = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const reactionsList = ["❤️", "🔥", "😆", "👍"];

const MessageBubble = ({ message, isOwn, userMeta, currentUid, roomId }) => {

  const handleReaction = async (emoji) => {
    const docRef = doc(db, "chatRooms", roomId, "messages", message.id);
    const currentReaction = message.reactions?.[currentUid.uid];

    const newReactions = { ...message.reactions };
    const newNames = { ...(message.reactorNames || {}) };

    if (currentReaction === emoji) {
      // Same emoji clicked again → remove reaction
      delete newReactions[currentUid.uid];
      delete newNames[currentUid.uid];
    } else {
      // New or different emoji → add/update reaction
      newReactions[currentUid.uid] = emoji;
      newNames[currentUid.uid] = userMeta.name;
    }

    await updateDoc(docRef, {
      reactions: newReactions,
      reactorNames: newNames,
    });
  };

  const groupedReactions = {};
  if (message.reactions) {
    Object.values(message.reactions).forEach((emoji) => {
      groupedReactions[emoji] = (groupedReactions[emoji] || 0) + 1;
    });
  }

  const getReactors = (emoji) => {
    if (!message.reactions) return [];
    return Object.entries(message.reactions)
      .filter(([, e]) => e === emoji)
      .map(([uid]) => {
        const match = message.reactorNames?.[uid];
        return match || uid;
      });
  };

  return (
    <Wrapper $isOwn={isOwn}>
      {message.avatar && <Avatar src={message.avatar} alt={message.name} />}
      <div>
        <Name>{message.name}</Name>
        <Bubble $isOwn={isOwn}>
          <div>
            {message.text}
            {Object.keys(groupedReactions).length > 0 && (
              <ReactionDisplay>
                {Object.entries(groupedReactions).map(([emoji, count]) => (
                  <span key={emoji} title={getReactors(emoji).join(", ")}>
                    {emoji} ×{count}
                  </span>
                ))}
              </ReactionDisplay>
            )}
          </div>
          <Reactions>
          {reactionsList.map((emoji) => (
              <Emoji
                key={emoji}
                onClick={() => handleReaction(emoji)}
                selected={message.reactions?.[currentUid.uid] === emoji}
              >
                {emoji}
              </Emoji>
          ))}
          </Reactions>
        </Bubble>
      </div>
    </Wrapper>
  );
};

export default MessageBubble;
