'use client'
import { useEffect, useState } from 'react';


export default function ShootingStar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return <div className={`shooting-star ${visible ? 'active' : ''}`} />;
}