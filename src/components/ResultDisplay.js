import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './ResultDisplay.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResultDisplay = ({ result, image, onReset }) => {

  // Prevent crash if result is null
  if (!result) {
    return (
      <div className="result-container">
        <h2>No prediction yet</h2>
      </div>
    );
  }

  const {
    predicted_class,
    confidence,
    all_probabilities,
    defect_detected
  } = result;

  const probabilities = all_probabilities || {};

  const chartData = {
    labels: Object.keys(probabilities),
    datasets: [
      {
        label: 'Confidence (%)',
        data: Object.values(probabilities).map(v => (v * 100).toFixed(2)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Defect Classification Probabilities',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="result-container">

      <div className="result-header">
        <h2>Analysis Results</h2>
        <button className="reset-button" onClick={onReset}>
          Analyze Another
        </button>
      </div>

      <div className="result-content">

        <div className="image-preview">
          <h3>Uploaded Wafer Map</h3>
          {image && <img src={image} alt="Uploaded wafer" />}
        </div>

        <div className="prediction-summary">

          <div className={`status-badge ${defect_detected ? 'defect' : 'good'}`}>
            {defect_detected ? '⚠️ Defect Detected' : '✓ No Defect'}
          </div>

          <div className="main-prediction">
            <h3>Predicted Defect Type</h3>
            <p className="defect-type">{predicted_class || "Unknown"}</p>
            <p className="confidence">
              Confidence: {confidence ? confidence : 0}%
            </p>
          </div>

          <div className="confidence-meter">
            <div className="meter-bar">
              <div
                className="meter-fill"
                style={{
                  width: `${confidence || 0}%`,
                  backgroundColor:
                    confidence > 80
                      ? '#4caf50'
                      : confidence > 50
                      ? '#ff9800'
                      : '#f44336'
                }}
              />
            </div>
          </div>

        </div>

      </div>

      <div className="chart-container">
        {Object.keys(probabilities).length > 0 && (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>

      <div className="detailed-results">
        <h3>Detailed Classification Scores</h3>

        <table>
          <thead>
            <tr>
              <th>Defect Type</th>
              <th>Probability</th>
              <th>Percentage</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(probabilities).map(([defectType, prob]) => (
              <tr
                key={defectType}
                className={defectType === predicted_class ? 'highlighted' : ''}
              >
                <td>{defectType}</td>
                <td>{prob.toFixed(4)}</td>
                <td>{(prob * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default ResultDisplay;