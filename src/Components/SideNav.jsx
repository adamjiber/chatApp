import { useNavigate } from 'react-router-dom';
import styles from '../styles/SideNav.module.css';

export default function SideNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Rensar hela localStorage
    localStorage.clear();
    
    // Redirectar till login-sidan
    navigate('/login');
  };

  return (
    <div className={styles.sidenavContainer}>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logga ut
      </button>
    </div>
  );
}
