// src/App.jsx
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, anonymousSignIn } from './firebase';
import Chat from './components/Chat';

function App() {
  const [user] = useAuthState(auth);

  const handleSignIn = () => {
    anonymousSignIn()
      .then(() => {
        console.log("Signed in anonymously");
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };

  return (
    <div className="App">
      {user ? (
        <Chat />
      ) : (
        <button onClick={handleSignIn}>Sign in Anonymously</button>
      )}
    </div>
  );
}

export default App;
