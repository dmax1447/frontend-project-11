import { v4 as uuidv4 } from 'uuid';

const parser = new DOMParser();

export const parseRSS = (string) => {
  const parsed = parser.parseFromString(string, 'application/xml');
  console.log(parsed);
  const feedId = uuidv4();
  return {
    feed: {
      id: feedId,
      title: parsed.querySelector('title').textContent,
      description: parsed.querySelector('description').textContent,
      link: parsed.querySelector('channel link').textContent,
    },
    posts: Array.from(parsed.querySelectorAll('item')).map((item) => ({
      guid: item.querySelector('guid').textContent,
      feedId,
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    })),
  };
};
