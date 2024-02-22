import React, { useState, useEffect } from "react";
import axios from "axios";

const GITHUB_API_URL = "https://api.github.com";
const PER_PAGE = 10;

const App = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${GITHUB_API_URL}/users/${username}`);
      setUser(response.data);
      setShowButtons(true);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  };

  const fetchRepos = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${GITHUB_API_URL}/users/${username}/repos?per_page=${PER_PAGE}&page=${page}`);
      setRepos(response.data);
    } catch (error) {
      console.error("Failed to fetch repositories:", error);
      setRepos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowButtons(false);
    fetchUser();
    fetchRepos(currentPage);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchRepos(newPage);
  };


    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full transition-transform transform hover:scale-105">
          <h1 className="text-4xl font-bold text-center mb-8 text-black transition-opacity duration-500 ease-in-out opacity-100 hover:opacity-95">
            GitHub Profile Viewer
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col items-center mb-8 transition-opacity duration-500 ease-in-out opacity-100 hover:opacity-95">
            <input
              type="text"
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className=" mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            <button type="submit" className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300">
              Show Profile
            </button>
          </form>
          {isLoading ? (
            <p className="text-gray-100 text-center transition-opacity duration-500 ease-in-out opacity-100 hover:opacity-95">Loading...</p>
          ) : user ? (
            <div className="text-center mb-4 transition-opacity duration-500 ease-in-out opacity-100 hover:opacity-95">
              <img
                src={user?.avatar_url}
                alt={user?.name || username}
                className="w-16 h-16 rounded-full border-4 border-white transition-transform transform hover:scale-110"
              />
              <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'No Name Provided'}</h2>
              <p className="text-gray-700">{user?.bio || 'No bio available.'}</p>
            </div>
          ) : (
            <p className="text-gray-100 text-center transition-opacity duration-500 ease-in-out opacity-100 hover:opacity-95">
              Enter a GitHub username to view their profile.
            </p>
          )}
  
          {showButtons && (
            <>
              {repos.map((repo, index) => (
                <div key={repo.id} className="mb-4 p-4 rounded shadow transition-opacity duration-500 ease-in-out opacity-100 hover:opacity-95 delay-100">
                  <h3 className="text-lg font-bold">{repo.name}</h3>
                  <p>{repo.description || 'No description'}</p>
                  {repo.topics && repo.topics.length > 0 && (
                    <ul className="flex flex-wrap">
                      {repo.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="mr-2 mb-2 bg-blue-200 rounded-full px-3 py-1 text-sm">
                          {topic}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
  
              <div className="flex justify-center">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition-transform transform hover:scale-105">
                  Previous
                </button>
                <button onClick={() => handlePageChange(currentPage + 1)} className="px-4 py-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-transform transform hover:scale-105">
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default App;
