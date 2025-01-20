// import React, { useState, useEffect, useRef, useCallback } from "react";
// import axios from "axios";

// const QASection = ({ documentId }) => {
//   const [question, setQuestion] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   // const [popupMessage, setPopupMessage] = useState(null); 
//   const [popupMessage] = useState(null); 

//   const chatEndRef = useRef(null);

//   const fetchHistory = useCallback(async () => {
//     try {
//       const response = await axios.get(`http://localhost:8000/api/files/${documentId}/history`);
//       setChatHistory(response.data.history || []);
//     } catch (error) {
//       console.error("Error fetching history:", error.message);
//     }
//   }, [documentId]);

//   useEffect(() => {
//     if (documentId) fetchHistory();
//   }, [documentId, fetchHistory]);

//   const handleAskQuestion = async () => {
//     if (!question) return alert("Please enter a question!");
  
//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:8000/api/qa/ask", {
//         documentId,
//         question,
//       });
  
//       const { answer, relevantContext } = response.data;
  
//       const newEntry = { question, answer, relevantContext };
//       setChatHistory((prev) => [...prev, newEntry]);
  
//       setQuestion(""); 
//       chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     } catch (error) {
//       if (error && error.status === 429) {
//         alert("Rate limit reached. Please try after a few minutes.");
//       } else {
//         console.error("Error fetching answer:", error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div className="flex flex-col h-full">
//       {popupMessage && (
//         <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-md">
//           {popupMessage}
//         </div>
//       )}

//       <div className="flex-grow overflow-y-auto border rounded p-4 bg-gray-50">
//         {chatHistory.map((entry, index) => (
//           <div key={index} className="mb-4">
//             <div>
//               <strong>Q:</strong> {entry.question}
//             </div>
//             <div>
//               <strong>A:</strong> {entry.answer}
//             </div>
//             {entry.relevantContext && (
//               <div className="mt-1 text-gray-500">
//                 <strong>Context:</strong> {entry.relevantContext}
//               </div>
//             )}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       <div className="mt-4">
//         <textarea
//           className="w-full border p-2"
//           placeholder="Type your question here..."
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           style={{ resize: "none" }}
//         />
//         <button
//           onClick={handleAskQuestion}
//           className={`bg-green-500 text-white px-4 py-2 rounded ${
//             loading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           disabled={loading}
//         >
//           {loading ? "Answering..." : "Ask"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QASection;

import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const QASection = ({ documentId }) => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupMessage] = useState(null);

  const chatEndRef = useRef(null);

  const fetchHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`https://qa-tw02.onrender.com/api/files/${documentId}/history`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatHistory(response.data.history || []);
    } catch (error) {
      console.error("Error fetching history:", error.message);
    }
  }, [documentId]);

  useEffect(() => {
    if (documentId) {
      fetchHistory();
      setQuestion(""); // Clear the input box when switching files
    }
  }, [documentId, fetchHistory]);

  const handleAskQuestion = async () => {
    if (!question) return alert("Please enter a question!");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post("https://qa-tw02.onrender.com/api/qa/ask", {
        documentId,
        question,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { answer, relevantContext } = response.data;

      const newEntry = { question, answer, relevantContext };
      setChatHistory((prev) => [...prev, newEntry]);

      setQuestion(""); // Clear the input box after successful submission
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      if (error.response && error.response.status === 429) {
        alert("Rate limit reached. Please try after a few minutes.");
      } else {
        console.error("Error fetching answer:", error.message);
      }
      setQuestion(""); // Clear the input box on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {popupMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-md">
          {popupMessage}
        </div>
      )}

      <div className="flex-grow overflow-y-auto border rounded p-4 bg-gray-50">
        {chatHistory.map((entry, index) => (
          <div key={index} className="mb-4">
            <div>
              <strong>Q:</strong> {entry.question}
            </div>
            <div>
              <strong>A:</strong> {entry.answer}
            </div>
            {entry.relevantContext && (
              <div className="mt-1 text-gray-500">
                <strong>Context:</strong> {entry.relevantContext}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4">
        <textarea
          className="w-full border p-2"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ resize: "none" }}
        />
        <button
          onClick={handleAskQuestion}
          className={`bg-green-500 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Answering..." : "Ask"}
        </button>
      </div>
    </div>
  );
};

export default QASection;
