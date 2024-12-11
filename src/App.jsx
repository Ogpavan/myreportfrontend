import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [extractedText, setExtractedText] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("Uploading Report...");
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0); // Track progress as a percentage
  const [ellipsis, setEllipsis] = useState(""); // For dynamic loading dots

  // Update ellipsis dynamically
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setEllipsis((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
      return () => clearInterval(interval); // Cleanup interval
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProgress(0); // Reset progress on new submission
    setLoadingStage("Uploading Report...");

    const formData = new FormData(e.target);

    try {
      // Step 1: Upload the report
      const response = await axios.post(
        "https://myreportbackend.onrender.com/process-report",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress(percent);
          },
        }
      );

      // Step 2: Update stage to "Extracting Text..."
      setLoadingStage("Extracting Text");
      setProgress(30); // Set progress to 30% after upload
      setExtractedText(response.data.text);

      // Step 3: Simulate a delay for analysis
      setTimeout(() => {
        setLoadingStage("Analyzing with AI");
        setProgress(60); // Set progress to 60% during analysis
        setAiAnalysis(response.data.analysis);

        // Step 4: Complete processing
        setTimeout(() => {
          setProgress(100); // Set progress to 100% when done
          setLoadingStage("Processing Complete!");
          setLoading(false);
        }, 100);
      }, 100);
    } catch (err) {
      setError("Error: " + err.message);
      setLoadingStage(""); // Clear loading stage on error
    } finally {
      setLoading(false); // Disable the loading spinner when processing is complete
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Medical Report Reader
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Upload a medical report image to analyze its contents.
        </p>

        <form
          id="uploadForm"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="flex flex-col"
        >
          <input
            type="file"
            name="reportImage"
            accept="image/*"
            required
            className="mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Upload and Analyze"}
          </button>
        </form>

        {loading && (
          <div className="mt-6">
            <div className="relative w-full h-2 bg-gray-200 rounded">
              <div
                className="absolute top-0 left-0 h-2 rounded bg-gradient-to-r from-blue-500 to-green-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-blue-500 text-center mt-2 font-medium">
              {loadingStage}
              {ellipsis}
            </p>
          </div>
        )}

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {aiAnalysis && (
          <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              AI Analysis Result
            </h2>
            <pre className="whitespace-pre-wrap text-gray-700 mt-2">
              {aiAnalysis}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
