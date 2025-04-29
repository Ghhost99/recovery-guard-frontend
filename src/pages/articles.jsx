import React, { useState, useEffect } from "react";
import Navbar from "@components/navbar";
import Footer from "@components/footer";
import { X } from "lucide-react";
import  {ArticleModal} from "@components/articles";

// const ArticleModal = ({ article, onClose }) => {
//   if (!article) return null;

//   return (
//     <div className="fixed inset-0 bg-black backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
//       <div className=" rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-white hover:text-black"
//         >
//           <X size={24} />
//         </button>
//         <div className="p-8">
//           <h2 className="text-2xl font-bold text-white mb-6">{article.title}</h2>
//           <div className="prose prose-invert text-gray-300 whitespace-pre-wrap">
//             {article.body}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const articlesPerPage = 6;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/article.xml");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const extractedArticles = Array.from(xmlDoc.getElementsByTagName("article")).map((article) => ({
          id: article.getAttribute("id"),
          title: article.querySelector("title")?.textContent || "Untitled Article",
          body: article.querySelector("body")?.textContent || "",
          shortDescription: article.querySelector("body")?.textContent.slice(0, 300).trim() + "...",
        }));

        setArticles(extractedArticles);
        setFilteredArticles(extractedArticles);
      } catch (e) {
        console.error("Failed to fetch articles:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Search functionality
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setFilteredArticles(articles); // Reset to all articles
    } else {
      const filtered = articles.filter((article) =>
        article.title.toLowerCase().includes(term) ||
        article.shortDescription.toLowerCase().includes(term)
      );
      setFilteredArticles(filtered);
    }

    setCurrentPage(1);
  };

  // Render pagination buttons
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredArticles.length / articlesPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center space-x-2 mt-8">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 rounded ${
              currentPage === number ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen  text-white p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Asset Recovery Articles</h1>

          {/* Search Input */}
          <div className="mb-8 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentArticles.map((article) => (
              <div
                key={article.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <h2 className="text-xl font-bold mb-4">{article.title}</h2>
                <p className="text-gray-300">{article.shortDescription}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {renderPagination()}

          {/* Article Modal */}
          {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ArticlesPage;
