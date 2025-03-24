import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { NewsArticle } from "../../../types/news";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

function NewsSlider({
  articles,
}: {
  articles: NewsArticle[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === articles.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? articles.length - 1 : prevIndex - 1));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 記事がない場合の表示
  if (!articles || articles.length === 0) {
    return <div>No news articles available</div>;
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className="relative w-full max-w-5xl mx-auto ">
      {/* 前へボタン */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Previous article"
      >
        <FiChevronLeft size={24} />
      </button>

      {/* カードコンポーネント */}
      <Card className="flex-1 border-[#888888] border-[0.5px] overflow-hidden h-[500px]">
        <CardHeader className="bg-white p-4">
          <CardTitle className="text-xl font-medium leading-[22px]">
            {currentArticle.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-64px)] p-0">
          <a
            href={currentArticle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full relative"
          >
            <div
              className="bg-center bg-cover h-full w-full absolute inset-0"
              style={{
                backgroundImage: `url(${currentArticle.urlToImage || "/placeholder-image.jpg"})`,
              }}
            />
            {/* mix-blend-modeを使ってオーバーレイ効果を適用 */}
            <div className="absolute inset-0 bg-gray-500 mix-blend-saturation" />

            <div className="text-white text-xl absolute bottom-10 font-medium leading-[22px] left-[15px] right-[15px] p-3 bg-opacity-60 rounded z-10">
              {currentArticle.description || "No description available"}
            </div>
          </a>
        </CardContent>
      </Card>

      {/* 次へボタン */}
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Next article"
      >
        <FiChevronRight size={24} />
      </button>

      {/* インジケーター (ドット) */}
      <div className="flex justify-center mt-4 space-x-2">
        {articles.map((article, index) => (
          <button
            key={article.url}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// 使用例
function NewsApp() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setArticles(data.articles);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <NewsSlider articles={articles} />;
}

export default NewsApp;
