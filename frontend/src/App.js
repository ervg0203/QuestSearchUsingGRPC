import React, { useState, useEffect } from "react";
import { SearchRequest } from "./proto/questions_pb";
import { QuestionServiceClient } from "./proto/questions_grpc_web_pb";
import "./app.css";

const grpcClient = new QuestionServiceClient(
  "http://localhost:8000",
  null,
  null
);

const searchQuestions = (searchQuery, currentPage = 1, resultsPerPage = 10) => {
  return new Promise((resolve, reject) => {
    const request = new SearchRequest();
    request.setQuery(searchQuery);
    request.setPage(currentPage);
    request.setPagesize(resultsPerPage);
    grpcClient.searchQuestions(request, {}, (err, response) => {
      if (err) {
        reject(err);
      } else {
        const questionsList = response.getQuestionsList();
        const formattedQuestions = questionsList.map((question) => ({
          id: question.getId(),
          type: question.getType(),
          title: question.getTitle(),
        }));
        const totalPages = response.getTotalpages();
        resolve({ questions: formattedQuestions, totalPages });
      }
    });
  });
};

const QuestionsComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    if (searchQuery) {
      searchQuestions(searchQuery, currentPage, resultsPerPage)
        .then(({ questions, totalPages }) => {
          setQuestions(questions);
          setTotalPages(totalPages);
        })
        .catch((err) => console.error("Error fetching data:", err));
    }
  }, [searchQuery, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchQuery(e.target.search.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">QuestSearch</h1>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          name="search"
          placeholder="Search questions..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <div className="questions-list">
        {questions.map((question) => (
          <div key={question.id} className="question-card">
            <h3>{question.title}</h3>
            <p className="question-type">Type: {question.type}</p>
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <div className="pagination-container">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionsComponent;
