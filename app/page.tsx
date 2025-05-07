'use client';

import { useEffect, useRef } from 'react';

export default function Page() {
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (imageRef.current) {
      imageRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    // Automatically set the image to fullscreen on load
    if (imageRef.current) {
      imageRef.current.requestFullscreen().catch(() => {
        console.warn("Fullscreen mode not supported or user declined.");
      });
    }
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
      <img
        ref={imageRef}
        src="https://beyondmebtw.com/assets/ulv.png"
        alt="Beyond Me Btw"
        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
        onClick={handleImageClick}
      />
    </div>
  );
}
