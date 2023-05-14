import { v4 as uuidv4 } from 'uuid';

const parser = new DOMParser();

export const parseRSS = (string) => {
  const parsed = parser.parseFromString(string, 'application/xml');
  const feedId = uuidv4();
  return {
    feed: {
      id: feedId,
      title: parsed.querySelector('title').textContent,
      description: parsed.querySelector('description').textContent,
    },
    posts: Array.from(parsed.querySelectorAll('item')).map((item) => ({
      id: uuidv4(),
      feedId,
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    })),
  };
};
