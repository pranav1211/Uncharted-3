'use client'
import { useState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Door({ href, no }) {

  const [input, setInput] = useState('');
  const [unlocked, setUnlocked] = useState(no !== 1); // Door 3 is unlocked by default

  const correctWords = {
    1: 'GEYTMIBRGA2CAMJQGEQDCMJUEAYTAMJAGEYTQIBRGAYSAMJRGQQDCMJVEAYTAMJAHE4SAMJQHAQDCMJREA4TSIBRGA3Q====',
  };

  const handleUnlock = () => {
    if (input === "GEYTMIBRGA2CAMJQGEQDCMJUEAYTAMJAGEYTQIBRGAYSAMJRGQQDCMJVEAYTAMJAHE4SAMJQHAQDCMJREA4TSIBRGA3Q====") {
      setUnlocked(true);
      redirect('/selene/GEYTMIBRGA2CAMJQGEQDCMJUEAYTAMJAGEYTQIBRGAYSAMJRGQQDCMJVEAYTAMJAHE4SAMJQHAQDCMJREA4TSIBRGA3Q====')
    }
    else if (input === "timeless") {
      setUnlocked(true);
      redirect('/selene/timeless')
    }
    else if (input === "ygtblnt") {
      setUnlocked(true);
      redirect('/selene/ygtblnt')
    }
  };

  return (
    <div className="door-wrapper">
      {unlocked ? (

        <div className="door">
          <Link href={href}>
            <div className="handle"></div>
            <span className="label">Door {no}</span>
          </Link>
          <input
            type="text"
             className="input px-4 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"            
          />


        </div>

      ) : (
        <div className="door locked">
          <div className="handle"></div>
          <span className="label">Door{no}</span>
          <input
            type="text"
            className="input px-4 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"            
            placeholder=""
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUnlock();
            }}
          />
        </div>
      )}
    </div>
  );
}
