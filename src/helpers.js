const parser = new DOMParser();

export const parseRSS = (string) => {
  const parsed = parser.parseFromString(string, 'application/xml');
  console.log(parsed.querySelectorAll('item'));
  const feed = {
    title: parsed.querySelector('title').textContent,
    description: parsed.querySelector('description').textContent,
    items: Array.from(parsed.querySelectorAll('item')).map((item) => ({
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    })),
  };
  return feed;
};
