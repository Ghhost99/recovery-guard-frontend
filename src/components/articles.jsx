import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Modal component with fixed positioning
const ArticleModal = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="sticky top-4 right-4 float-right text-white hover:text-gray-300 z-10"
        >
          <X size={24} />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">{article.title}</h2>
          <div className="prose prose-invert text-gray-300 whitespace-pre-wrap">
            {article.body}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modify ArticleCard to accept onClick handler
const ArticleCard = ({ title, description, onClick }) => (
  <div 
    className="backdrop-blur-sm p-4 rounded-lg shadow-md w-64 flex-shrink-0 transition transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    onClick={onClick}
  >
    <h3 className="text-lg font-semibold mt-3 text-white">{title}</h3>
    <p className="text-white text-sm mt-2 line-clamp-3">
      {description || title.substring(0, 100) + '...'}
    </p>
  </div>
);

const FeaturedArticles = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/article.xml');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const extractedArticles = Array.from(xmlDoc.getElementsByTagName("article")).map(article => ({
          id: article.getAttribute('id'),
          title: article.querySelector("title")?.textContent || "Untitled Article",
          description: article.querySelector("body")?.textContent.substring(0, 250) + "...",
          body: article.querySelector("body")?.textContent || "",
        }));
        setArticles(extractedArticles);
        setIsLoading(false);
      } catch (e) {
        console.error("Failed to fetch articles:", e);
        setError(e.message);
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({ left: direction === "left" ? -clientWidth : clientWidth, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="relative p-6 w-full max-w-6xl mx-auto">
        <p className="text-gray-400 text-center py-4">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative p-6 w-full max-w-6xl mx-auto">
        <p className="text-red-400 text-center py-4">Error loading articles: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative px-6 py-10 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Asset Recovery Articles</h2>
          <p className="text-gray-400 text-sm mt-1">
            Explore our latest articles on asset recovery.
          </p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 text-sm self-start md:self-auto"   onClick={() => handleNavigate("/article")}>
          View All Articles →
        </button>
      </div>

      {/* Carousel */}
      <div className="relative w-full">
        {articles.length > 0 ? (
          <>
            {/* Left Scroll Button */}
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md z-10"
              onClick={() => scroll("left")}
            >
              <ArrowLeft size={20} className="text-white" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-x-auto scroll-smooth hide-scrollbar">
              <div
                ref={scrollRef}
                className="flex space-x-6 px-4 w-fit min-w-full"
              >
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    description={article.description}
                    onClick={() => setSelectedArticle(article)}
                  />
                ))}
              </div>
            </div>

            {/* Right Scroll Button */}
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md z-10"
              onClick={() => scroll("right")}
            >
              <ArrowRight size={20} className="text-white" />
            </button>
          </>
        ) : (
          <p className="text-gray-400 text-center py-4">No articles available.</p>
        )}
      </div>

      {/* Article Modal */}
      {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
    </div>
  );
};

export default FeaturedArticles;
export { ArticleModal, ArticleCard };