import { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/Chat.module.css';  // Importera modulär CSS
import SideNav from './SideNav';  // Importera SideNav

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const token = localStorage.getItem('token');
  const avatar = localStorage.getItem('avatar');
  const navigate = useNavigate();

  // JWT-dekodning
  const decodeJWT = (token) => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      console.error("Invalid JWT token", e);  // Hantera ogiltiga token-fel
      return null;
    }
  };

  const decodedJwt = decodeJWT(token);  // Dekodera JWT och kontrollera
  const { id: userId, user: username } = decodedJwt || {};  // Hämta userId och username från token

  // Fake messages för att simulera en riktig konversation
  const fakeMessages = [
    { text: 'Jag skulle kunna äta dem varje dag!', username: 'Ferid', avatar: 'https://i.pravatar.cc/100' },
    { text: 'Bästa burgarna jag någonsin ätit!', username: 'Mike', avatar: 'https://i.pravatar.cc/101' },
    { text: 'När kan jag få beställa nästa gång?', username: 'Osman', avatar: 'https://i.pravatar.cc/102' },
    { text: 'Ja dina burgare är verkligen otroliga!', username: 'Koshin', avatar: 'https://i.pravatar.cc/103' }
  ];

  useEffect(() => {
    if (!token) {
      navigate('/login');  // Om ingen token finns, omdirigera till login
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !token) return;  // Säkerställ att userId och token finns
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);  // Sätt meddelanden i state
      } catch (error) {
        console.error('Error fetching messages:', error);  // Hantera fel vid hämtning av meddelanden
      }
    };

    fetchMessages();
  }, [token, userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const sanitizedMessage = DOMPurify.sanitize(newMessage);  // Sanitering av meddelandetext

    if (sanitizedMessage.trim() && userId) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/messages`,
          {
            text: sanitizedMessage,
            conversationId: null,
            userId: parseInt(userId),  // Använd decoded userId
            avatar: avatar,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-CSRF-Token': localStorage.getItem('csrfToken'),
            },
          }
        );

        setMessages((prevMessages) => [...prevMessages, {
          ...response.data.latestMessage,
          userId: parseInt(userId), 
          username: username,
          avatar: avatar,
        }]);
        setNewMessage('');  // Nollställ textfältet efter att meddelandet skickats
      } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);  // Hantera fel vid meddelandeskick
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId) {
      console.error("Message ID is undefined");  // Kontrollera om meddelande-ID saknas
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': localStorage.getItem('csrfToken'),
        },
      });

      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));  // Ta bort meddelande från state
    } catch (error) {
      console.error('Error deleting message:', error.response?.data || error.message);  // Hantera fel vid meddelanderadering
    }
  };

  return (
    <div className={styles.chatContainer}>
      <SideNav />  {/* Lägg till SideNav här */}
      <h1>Chat</h1>
      <div className={styles.messagesContainer}>
        {fakeMessages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles.other}`}>
            <img src={msg.avatar} alt="avatar" className={styles.avatar} />
            <div className={styles.messageContent}>
              <strong>{msg.username}</strong>
              <p>{DOMPurify.sanitize(msg.text)}</p>
            </div>
          </div>
        ))}
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.message} ${msg.userId === parseInt(userId) ? styles.self : styles.other}`}>
            <div className={styles.messageContent}>
              <strong>{msg.userId === parseInt(userId) ? username : 'Other User'}</strong>
              <p>{DOMPurify.sanitize(msg.text)}</p>
              {msg.userId === parseInt(userId) && (
                <button className={styles.deleteButton} onClick={() => handleDeleteMessage(msg.id)}>
                  ✖
                </button>
              )}
            </div>
            <img src={msg.avatar || 'https://i.pravatar.cc/100'} alt="avatar" className={styles.avatar} />
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className={styles.messageForm}>
        <input
          type="text"
          placeholder="Skriv ett meddelande..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={styles.messageInput}
          required
        />
        <button type="submit" className={styles.sendButton}>Skicka</button>
      </form>
    </div>
  );
}
