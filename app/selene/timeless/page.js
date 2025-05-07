import Door from '@/components/Door';
import Link from 'next/link';
export default function EternityPage() {
  return (
    <div className="page">
      <div className="">
        <Door href='/ygtblnt' no={1} />

      </div>
      <p className='chemical'>This time, there is just a list of numbers given, and at first glance, it doesn't look like the same kind of substitution cipher as the previous ones.</p><br />
      <p className='chemical'>Beyond limits, everything breaks down to its elements — decode the numbers using the table of elements.</p><br />
      <p className='chemical'>39, 8, 92, 31, 8, 22, 22, 75, 8, 3, 3, 68, 66, 5, 68, 22, 22, 68, 75, 3, 92, 6, 19, 7, 68, 54, 22, 53, 42, 68</p>

    </div>
  );
}