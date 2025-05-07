import { getRandomLinks } from '../utils/randomLinks';
import Door from './Door';

export default function RandomNav({ currentPath,className }) {
  const links = getRandomLinks(currentPath);

  return (
    <div className={className}>
      {links.map((href) => (
        <Door key={href} href={href} />
      ))}
    </div>
  );
}
