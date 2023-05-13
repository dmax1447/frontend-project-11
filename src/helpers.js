import { v4 as uuidv4 } from 'uuid';

const parser = new DOMParser();

export const parseRSS = (string) => {
  const parsed = parser.parseFromString(string, 'application/xml');
  console.log(parsed);
  const feed = {
    id: uuidv4(),
    title: parsed.querySelector('title').textContent,
    description: parsed.querySelector('description').textContent,
    posts: Array.from(parsed.querySelectorAll('item')).map((item) => ({
      id: uuidv4(),
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    })),
  };
  return feed;
};
