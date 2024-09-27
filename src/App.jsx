import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react'; // Import necessary hooks
import Register from './Components/Register';
import Login from './Components/Login';
import Chat from './Components/Chat';

function App() {
  const [csrfToken, setCsrfToken] = useState(null); // State to store CSRF token

  // Fetch CSRF token when the component mounts
  useEffect(() => {
    fetch('https://chatify-api.up.railway.app/csrf', {
      method: 'PATCH',
    })
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrfToken); // Set CSRF token in state
      })
      .catch((error) => console.error('Failed to fetch CSRF token', error));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register csrfToken={csrfToken} />} /> {/* Pass CSRF token to Register */}
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
