import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';  // Importera Link för navigering till Register-sidan
import styles from '../styles/Login.module.css';  // Importera modulär CSS

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://chatify-api.up.railway.app/auth/token', {
        username,
        password,
      });

      const { token } = response.data;

      // Spara token i localStorage
      localStorage.setItem('token', token);

      // Dekodera JWT-token och spara information i localStorage
      const decodedJwt = JSON.parse(atob(token.split('.')[1]));

      localStorage.setItem('userId', decodedJwt.id);
      localStorage.setItem('username', decodedJwt.user);
      localStorage.setItem('avatar', decodedJwt.avatar || '');
      localStorage.setItem('decodedJwt', JSON.stringify(decodedJwt));

      // Hämta CSRF-token och spara det
      const csrfResponse = await axios.patch('https://chatify-api.up.railway.app/csrf', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem('csrfToken', csrfResponse.data.csrfToken);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Login</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <p>
        Don't have an account? <Link to="/register" className={styles.link}>Register here</Link>
      </p>
    </div>
  );
}
