import React, { useEffect, useState } from "react";
import DocumentUpload from "../components/DocumentUpload";
import QASection from "../components/QASection";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const [documents, setDocuments] = useState([]);
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [activeDocumentTitle, setActiveDocumentTitle] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchDocuments(); 
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("https://qa-tw02.onrender.com/api/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDocuments(response.data.documents);
  
      if (response.data.documents.length > 0) {
        setActiveDocumentId(response.data.documents[0]._id);
        setActiveDocumentTitle(response.data.documents[0].title);
      }
    } catch (error) {
      console.error("Error fetching documents:", error.message);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please log in again.");
        // Redirect to login page
        window.location.href = "/login";
      }
    }
  };
  
  const handleDocumentClick = (docId, title) => {
    setActiveDocumentId(docId);
    setActiveDocumentTitle(title);
  };

  const handleUploadComplete = async (newDocument) => {
    setDocuments((prev) => [...prev, newDocument]); 
    setActiveDocumentId(newDocument._id); 
    setActiveDocumentTitle(newDocument.title);
    setShowUpload(false); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isSidebarOpen ? (
              // X (close) icon
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              // Hamburger menu icon
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Document Q&A</h1>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] md:h-screen">
        {/* Sidebar with overlay */}
        <div 
          className={`
            fixed md:static inset-0 bg-gray-600 bg-opacity-50 md:bg-transparent
            transition-all duration-300 ease-in-out z-40
            ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible md:opacity-100 md:visible'}
          `}
          onClick={(e) => {
            // Close sidebar when clicking overlay (but not when clicking sidebar content)
            if (e.target === e.currentTarget) {
              setIsSidebarOpen(false);
            }
          }}
        >
          <div 
            className={`
              w-3/4 md:w-80 h-full bg-white md:bg-gray-100 p-6 overflow-y-auto border-r
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
          >
            {/* Mobile Close Button */}
            <div className="flex md:hidden justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Documents</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Desktop Header - remains unchanged */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Documents</h2>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
                title="Logout"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => setShowUpload((prev) => !prev)}
              className="mb-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg w-full
                transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {showUpload ? "Cancel Upload" : "Upload New File"}
            </button>

            {showUpload && (
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                <DocumentUpload onUploadComplete={handleUploadComplete} />
              </div>
            )}

            <ul className="space-y-2">
              {documents.map((doc) => (
                <li
                  key={doc._id}
                  onClick={() => {
                    handleDocumentClick(doc._id, doc.title);
                    setIsSidebarOpen(false);
                  }}
                  className={`cursor-pointer p-4 rounded-lg transition-all duration-200 
                    ${doc._id === activeDocumentId 
                      ? "bg-blue-500 text-white shadow-md transform scale-102" 
                      : "bg-white hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">{doc.title}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
              {activeDocumentTitle 
                ? `Q&A: ${activeDocumentTitle}`
                : "Select a Document to Start"}
            </h1>
            
            {activeDocumentId ? (
              <QASection documentId={activeDocumentId} />
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 text-lg">
                  Please select a document from the sidebar to start the Q&A session.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

