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
    if (input === "GEYTMIBRGA2CAMJQGEQDCMJUEAYTAMJAGEYTQIBRGAYSAMJRGQQDCMJVEAYTAMJAHE4SAMJQHAQDCMJREA4TSIBRGA3Q====" ) {
      setUnlocked(true);
      redirect('/selene/GEYTMIBRGA2CAMJQGEQDCMJUEAYTAMJAGEYTQIBRGAYSAMJRGQQDCMJVEAYTAMJAHE4SAMJQHAQDCMJREA4TSIBRGA3Q====')
    }
    else if(input === "timeless"){
      setUnlocked(true);
      redirect('/selene/timeless')
    }
    else if(input === "ygtblnt"){
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
            <span className="label">Enter Door {no}</span>
            </Link>
            <input
            type="text"
            className="input"
            placeholder="Unlock code"
            
          />
          </div>
        
      ) : (
        <div className="door locked">
          <div className="handle"></div>
          <span className="label"> Enter Door {no}</span>
          <input
            type="text"
            className="input"
            placeholder="Unlock code"
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
