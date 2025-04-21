// App.jsx
import { useState, useEffect } from "react";
import styled from "styled-components";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import AuthForm from "./components/AuthForm";
import UserSetupModal from "./components/UserSetupModal";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import TypingIndicator from "./components/TypingIndicator";
import UserList from "./components/UserList";
import ChatList from "./components/ChatList";
import { signOut } from "firebase/auth";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
`;


const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const UserInfo = styled.p`
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.highlight};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  cursor: pointer;
`;

const TabWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem;
  flex-wrap: wrap;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const TabButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 1rem;
  background: ${({ active, theme }) => (active ? theme.accent : "#ccc")};
  color: ${({ active }) => (active ? "white" : "black")};
  border: none;
  cursor: pointer;
`;

const App = ({ toggleTheme, isDarkMode }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userMeta, setUserMeta] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setUserMeta(snap.data());
          } else {
            setUserMeta(null);
          }
        } catch (error) {
          console.error("Failed to fetch userMeta:", error);
          setUserMeta(null);
        }
      } else {
        setUserMeta(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (authLoading) return <p style={{ padding: "2rem" }}>Loading...</p>;
  if (!firebaseUser) return <AuthForm />;

  const roomId = activeChatUser
    ? [firebaseUser.uid, activeChatUser.uid].sort().join("_")
    : null;

  return (
    <Container>
      {firebaseUser?.uid && !userMeta && (
        <UserSetupModal onComplete={(data) => setUserMeta(data)} />
      )}

      {firebaseUser?.uid && userMeta && (
        <>
          <Header>
            <UserInfo>
              Signed in as: <strong>{userMeta.name}</strong>
            </UserInfo>
            <ButtonGroup>
              <Button onClick={() => signOut(auth)}>Logout</Button>
              <Button onClick={toggleTheme}>
                {isDarkMode ? "Light" : "Dark"} Mode
              </Button>
            </ButtonGroup>
          </Header>
          <TabWrapper>
            <TabButton active={activeTab === "chat"} onClick={() => setActiveTab("chat")}>
              📥 Messages
            </TabButton>
            <TabButton active={activeTab === "users"} onClick={() => setActiveTab("users")}>
              📇 People
            </TabButton>
          </TabWrapper>
          {activeTab === "chat" && (
            <ChatList
              currentUser={firebaseUser}
              onSelectChat={(user) => setActiveChatUser(user)}
            />
          )}
          {activeTab === "users" && (
            <UserList
              currentUser={firebaseUser}
              onSelectUser={(user) => setActiveChatUser(user)}
            />
          )}
          {activeChatUser && (
            <>
              <TypingIndicator roomId={roomId} />
              <ChatWindow
                userMeta={userMeta}
                currentUid={firebaseUser.uid}
                roomId={roomId}
              />
              <MessageInput
                userMeta={userMeta}
                roomId={roomId}
                recipient={activeChatUser}
              />
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default App;