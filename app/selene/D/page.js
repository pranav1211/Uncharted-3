'use client';

import { useState } from 'react';


export default function RedHerring() {
  const [decoded, setDecoded] = useState('');
  const [showDecoded, setShowDecoded] = useState(false);

  const cipherText = `19 8 5 20 1 14 9 3 8 5 6 6 5 18 
3 1 5 19 1 18 12 15 20 1 20 9 14 
14 15 20 20 8 5 16 1 20 8`;

  const decode = () => {
    const decodedMessage = cipherText
      .split(/\s+/)
      .map((num) => String.fromCharCode(parseInt(num) + 64))
      .join('');
    setDecoded(decodedMessage);
    setShowDecoded(true);
  };

  return (
    <div className="page">
      <h1 className="title">Cipher of the Lost Path</h1>
      <p className="riddle">
        In the silence of numbers, echoes a name...<br />
        Decode the ancient signal hidden within.
      </p>
      <pre className="cipher-block">
        {cipherText}
      </pre>

      {!showDecoded && (
        <button className="decode-btn" onClick={decode}>Translate Cipher</button>
      )}

      {showDecoded && (
        <div className="decoded-text">
          <strong>Decoded Sequence:</strong><br />
          <code>{decoded}</code>
          <p className="decoded-text">
            Could this be a name? Or is it hiding a location? Try applying another cipher...
          </p>
        </div>
      )}
    </div>
  );
}
