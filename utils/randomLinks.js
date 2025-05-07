export function getRandomLinks(current) {
    const pages = ['/', '/B', '/C', '/D'].filter((p) => p !== current);
    const shuffled = pages.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }