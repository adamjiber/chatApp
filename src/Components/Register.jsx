import { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate, Link } from 'react-router-dom'; 
import styles from '../Styles/Register.module.css';  // Använder modulär CSS

export default function Register() { 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [avatar, setAvatar] = useState('');  
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState(false); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => { 
    e.preventDefault();  // Hindra sidan från att ladda om
    setError('');  // Nollställ eventuella gamla felmeddelanden

    // Om avatar-fältet är tomt, sätt en avatar från pravatar
    const avatarUrl = avatar || `https://i.pravatar.cc/150?u=${username}`;

    try { 
      const response = await axios.post('https://chatify-api.up.railway.app/auth/register', { 
        username, 
        password, 
        email, 
        avatar: avatarUrl, // Använd pravatar om ingen är specificerad
      }); 
      setSuccess(true);  // Visa att registreringen lyckades
      localStorage.setItem('token', response.data.token);  // Spara token i localStorage
      localStorage.setItem('userId', response.data.userId);  // Spara userId i localStorage
      localStorage.setItem('avatar', response.data.avatar);  // Spara avatar i localStorage
      setTimeout(() => navigate('/login'), 1500);  // Vänta 1,5 sek innan omdirigering till login-sidan
    } catch (err) { 
      setError(err.response?.data?.message || 'An error occurred');  // Visa felmeddelande om något går fel
    } 
  }; 

  return ( 
    <div className={styles.container}> 
      <h1 className={styles.title}>Register</h1> 
      <form className={styles.form} onSubmit={handleSubmit}> 
        {/* Användarnamn fält */}
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className={styles.input}
          required 
        /> 
        {/* E-post fält */}
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className={styles.input}
          required 
        /> 
        {/* Lösenord fält */}
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className={styles.input}
          required 
        /> 
        {/* Avatar URL fält */}
        <input 
          type="text" 
          placeholder="Avatar URL" 
          value={avatar} 
          onChange={(e) => setAvatar(e.target.value)} 
          className={styles.input}
        /> 
        <button type="submit" className={styles.button}>Register</button> 
      </form> 
      {error && <p className={styles.error}>{error}</p>}  {/* Visa felmeddelande om registreringen misslyckas */}
      {success && <p className={styles.success}>Registration successful! Redirecting...</p>}  {/* Visa om registreringen lyckas */}
      <p>
        Already have an account? <Link to="/login">Log in here</Link>
      </p>
    </div> 
  ); 
}
