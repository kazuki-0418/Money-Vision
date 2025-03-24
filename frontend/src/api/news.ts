export const getNewsApi = async () => {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  return data.articles;
};
