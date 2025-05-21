'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import clockImg from './images/broken-clock.png';
import Door from '@/components/Door';

export default function Home() {
  const [showClue, setShowClue] = useState(false);
  const bufferRef = useRef('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      const char = e.key.length === 1 ? e.key.toLowerCase() : '';
      bufferRef.current += char;

      // Limit buffer size
      if (bufferRef.current.length > 10) {
        bufferRef.current = bufferRef.current.slice(-10);
      }

      if (bufferRef.current.includes('link')) {
        setShowClue(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="page">
      <div className="puzzle-image">
        <p>
        To proceed, just type the word into the screen, the word is one that connects pages — it is a synonym of connect.
        </p>
        <Image 
          src={clockImg}
          alt="First puzzle clue" 
          width={500} 
          height={500}
        />
      </div>

      {showClue && (
        <div className="secret-box mt-4 text-green-600 font-semibold">
          The hands of time do more than tell — they point to secrets in plain sight. Numbers you see may not be what they seem.
          Look at the clock. Think in encryption. Now, what if time spoke in base 32? Use this site do decode : <a href="https://emn178.github.io/online-tools/base32_encode.html">Site</a> If the code does not work, try to refresh the page.
        </div>
      )}

      <h1>The stars do not begin, they simply are.</h1>
      <p className="hint">The first key to eternity is the one that begins time. Some doors are not what they seem, some will lead you to eternal glory while others to eternal despair</p>
      <p className="hint">Enter the passwords in the white boxes and press enter, if its correct you will go forward</p>
      <p className="hint">To enter a door, click on the "door" name at the bottom of the door</p>

      <div className="main">
        <Door href="/selene/GEYTMIBRGA2CAMJQGEQDCMJUEAYTAMJAGEYTQIBRGAYSAMJRGQQDCMJVEAYTAMJAHE4SAMJQHAQDCMJREA4TSIBRGA3Q====" no={1} />
        <Door href="/selene/B" no={2} />
        <Door href="/selene/C" no={3} />
      </div>
    </div>
  );
}
