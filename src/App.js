import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import ImageUpload from './components/ImageUpload';
import ResultDisplay from './components/ResultDisplay';
import Header from './components/Header';

const API_URL = 'http://localhost:5000';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during prediction');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setUploadedImage(null);
  };

  return (
    <div className="App">
      <Header />
      
      <main className="container">
        <div className="upload-section">
          <ImageUpload 
            onImageUpload={handleImageUpload} 
            loading={loading}
            disabled={loading}
          />
        </div>

        {error && (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Analyzing wafer map...</p>
          </div>
        )}

        {result && (
          <ResultDisplay 
            result={result} 
            image={uploadedImage}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}

export default App;
