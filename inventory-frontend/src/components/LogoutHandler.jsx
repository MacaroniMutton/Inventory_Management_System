import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogoutEvent = () => {
      navigate('/login', { replace: true });
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
  }, [navigate]);

  return null;
}

export default LogoutHandler;
