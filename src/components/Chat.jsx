import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import Message from './Message';
import { getGeminiResponse } from '../services/geminiService';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleVoiceInput = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setInput(transcript);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Save user message to Firestore
    await addDoc(collection(db, 'messages'), {
      text: input,
      createdAt: new Date(),
    });

    // Get response from Gemini and save it to Firestore
    const botResponse = await getGeminiResponse(input);
    await addDoc(collection(db, 'messages'), {
      text: botResponse,
      createdAt: new Date(),
    });

    setInput('');
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={msg.id} text={msg.text} isUserMessage={index % 2 !== 0} />
        ))}
      </div>
      <form onSubmit={sendMessage} className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
        />
        <button type="button" onClick={handleVoiceInput} className={`voice-button ${listening ? 'listening' : ''}`}>
          <FaMicrophone />
        </button>
        <button type="submit" className="send-button">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

export default Chat;
