import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SpaNavListener() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleNav = (e: Event) => {
      e.preventDefault();
      const customEvent = e as CustomEvent;
      const target = customEvent.detail.target;
      console.log('SPA handling navigation to:', target);
      try {
        const url = new URL(target, window.location.origin);
        navigate(url.pathname + url.search + url.hash);
      } catch(err) {
        navigate(target);
      }
    };

    document.addEventListener('webavatar-navigate', handleNav);
    return () => document.removeEventListener('webavatar-navigate', handleNav);
  }, [navigate]);

  return null;
}
