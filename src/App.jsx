import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [extractedText, setExtractedText] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(""); // Track the current stage
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLoadingStage("Uploading Report...");

    const formData = new FormData(e.target);

    try {
      // Make the request
   const response = await axios.post(
        "https://myreportbackend.onrender.com/process-report",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the loading stage after successful upload
      setLoadingStage("Extracting Text...");
      setExtractedText(response.data.text);

      // Simulate a delay to reflect analysis stage
      setTimeout(() => {
        setLoadingStage("Analyzing with AI...");
        setAiAnalysis(response.data.analysis);
      }, 1000); // Adjust the delay if necessary

      // Reset the stage after completion
      setTimeout(() => {
        setLoadingStage("");
      }, 2000);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Medical Report Reader
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Upload a medical report image to analyze its contents.
      </p>

      <form
        id="uploadForm"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col items-center"
      >
        <input
          type="file"
          name="reportImage"
          accept="image/*"
          required
          className="mb-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {loading ? loadingStage : "Upload and Analyze"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div
        className={`output mt-8 p-6 border border-gray-300 rounded-md shadow-sm bg-white ${
          extractedText || aiAnalysis ? "block" : "hidden"
        }`}
      >
        <p className="font-medium text-gray-800">Extracted Text:</p>
        <pre className="whitespace-pre-wrap text-gray-700 mt-2">
          {extractedText}
        </pre>
        <p className="font-medium text-gray-800 mt-4">AI Analysis:</p>
        <pre className="whitespace-pre-wrap text-gray-700 mt-2">
          {aiAnalysis}
        </pre>
      </div>
    </div>
  );
};

export default App;
