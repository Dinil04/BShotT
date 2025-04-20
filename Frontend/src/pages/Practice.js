import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './Practice.css';
import { FaCloudUploadAlt, FaCheckCircle, FaTimesCircle, FaTrashAlt, FaDownload, FaVideo } from 'react-icons/fa';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { CSVLink } from 'react-csv';

const Practice = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [showLiveFeed, setShowLiveFeed] = useState(false);
  const [selectedShotType, setSelectedShotType] = useState('Defence'); // Default shot type
  const [liveFeedUrl] = useState("http://localhost:5001/video_feed");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [showPopup, setShowPopup] = useState(false); // Added missing state
  const [angleFeedback, setAngleFeedback] = useState(null);
  const [liveFeedKey, setLiveFeedKey] = useState(Date.now()); // To force remount the live feed image

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    setHistory(storedHistory);
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allowedFileTypes = ['mp4', 'mov', 'avi'];
  const maxFileSizeMB = 100;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/mp4': [],
      'video/quicktime': [],
      'video/avi': []
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file && validateFile(file)) {
        setSelectedFile(file);
        setPreviewURL(URL.createObjectURL(file));
        setErrorMsg('');
      }
    },
  });

  const validateFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const sizeMB = file.size / 1024 / 1024;
    if (!allowedFileTypes.includes(ext)) {
      setErrorMsg('Invalid file type! Only MP4, MOV, AVI allowed.');
      return false;
    }
    if (sizeMB > maxFileSizeMB) {
      setErrorMsg(`File is too large! Max ${maxFileSizeMB}MB.`);
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!selectedFile) return setErrorMsg('Please select a video file first!');
    setUploading(true);
    setErrorMsg('');
    setResult(null);
    setProgress(0);
    setLoadingMessage('Starting video processing...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoadingMessage('Processing complete!');
          return 100;
        }
        if (prev >= 70) setLoadingMessage('Almost done...');
        else if (prev >= 50) setLoadingMessage('Processing...');
        else setLoadingMessage('Starting...');
        return prev + 10;
      });
    }, 500);

    try {
      const response = await axios.post('http://localhost:5001/predict', formData);
      if (response.data.error) {
        setErrorMsg(response.data.error);
      } else {
        const data = response.data;
        setResult(data);
        const previous = JSON.parse(localStorage.getItem('history')) || [];
        const updated = [...previous, {
          prediction: data.prediction,
          accuracy: data.accuracy,
          message: data.message,
          feedback: data.feedback,
          mark: data.mark,
          timestamp: new Date().toLocaleString()
        }];
        localStorage.setItem('history', JSON.stringify(updated));
        setHistory(updated);
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // New function to fetch angle feedback after live feed stops
  const fetchAngleFeedback = async () => {
    try {
      const response = await axios.post('http://localhost:5001/angle_feedback', { shot_type: selectedShotType });
      if (response.data.feedback) {
        setAngleFeedback(response.data);
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error fetching angle feedback:', error);
      setErrorMsg('Error fetching angle feedback.');
    }
  };

  const toggleLiveFeed = () => {
    if (!isDesktop) return setErrorMsg("Live feed is only supported on desktop.");
    if (!showLiveFeed) {
      // Force remount the live feed image by updating the key with a timestamp
      setLiveFeedKey(Date.now());
      setShowLiveFeed(true);
      // Automatically stop live feed after 10 seconds and fetch angle feedback
      setTimeout(() => {
        setShowLiveFeed(false);
        fetchAngleFeedback();
      }, 10000);
    } else {
      setShowLiveFeed(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewURL('');
    setUploading(false);
    setResult(null);
    setErrorMsg('');
    setProgress(0);
    setLoadingMessage('');
    setShowLiveFeed(false);
  };

  const handleRemoveResult = (index) => {
    const updated = history.filter((_, i) => i !== index);
    localStorage.setItem('history', JSON.stringify(updated));
    setHistory(updated);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Shot Analysis Results', 20, 10);
    doc.text(`Shot Type: ${result.prediction}`, 20, 20);
    doc.text(`Accuracy: ${result.accuracy}%`, 20, 30);
    doc.text(`Feedback: ${result.feedback}`, 20, 40);
    doc.text(`Shot Mark: ${result.mark}`, 20, 50);
    doc.save('Shot_Analysis.pdf');
  };

  const headers = [
    { label: 'Shot Type', key: 'prediction' },
    { label: 'Accuracy', key: 'accuracy' },
    { label: 'Feedback', key: 'feedback' },
    { label: 'Shot Mark', key: 'mark' }
  ];

  const handleShotTypeChange = (event) => {
    setSelectedShotType(event.target.value);
  };

  return (
    <div className="practice-container">
      {/* Video Upload Section */}
      <div className="upload-section">
        <h2>Practice Your Cricket Shots</h2>
        <p>Upload a cricket shot video and get instant AI-powered feedback!</p>
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <FaCloudUploadAlt className="upload-icon" />
          {isDragActive ? <p>Drop your video here...</p> : <p>Drag & drop or click to select a video</p>}
        </div>
        {previewURL && (
          <div className="preview-section">
            <h3>Video Preview</h3>
            <video src={previewURL} controls width="400px" />
          </div>
        )}
        <button onClick={handleUpload} disabled={uploading} className="upload-btn">
          {uploading ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
        <button onClick={handleReset} className="reset-btn">Reset</button>
        {errorMsg && <div className="error-popup"><FaTimesCircle /> <p>{errorMsg}</p></div>}
        {uploading && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}>
              <div className="progress-text">{progress}%</div>
            </div>
            <div className="spinner-container"><div className="spinner"></div></div>
            <div className="loading-message">{loadingMessage}</div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="result-section">
        {result && (
          <div className="result-box">
            <FaCheckCircle className="success-icon" />
            <h3>Prediction Result</h3>
            <p><strong>Shot Type:</strong> {result.prediction}</p>
            <p><strong>Accuracy:</strong> {result.accuracy}%</p>
            <p className="success-msg">{result.message}</p>
            <div className="feedback-container">
              <h4>Feedback:</h4>
              <p>{result.feedback}</p>
              <p><strong>Shot Mark: </strong>{result.mark}</p>
              <div className="export-buttons">
                <button onClick={exportToPDF} className="export-btn"><FaDownload /> PDF</button>
                <CSVLink data={[result]} headers={headers} filename="Shot_Analysis.csv">
                  <button className="export-btn"><FaDownload /> CSV</button>
                </CSVLink>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shot Type Selection and Live Feed Section */}
      <div className="shot-type-selection-container">
        <h3>Select Shot Type</h3>
        <select onChange={handleShotTypeChange} value={selectedShotType}>
          <option value="Defence">Defence</option>
          <option value="Cut_shot">Cut Shot</option>
          <option value="Cover_Drive">Cover Drive</option>
          <option value="Pull_Shot">Pull Shot</option>
          <option value="Sweep_Shot">Sweep Shot</option>
        </select>
        <div className="live-feed-section">
          <button onClick={toggleLiveFeed} className="live-feed-btn">
            <FaVideo /> {showLiveFeed ? "Stop Live Feed" : "Start Live Feed"}
          </button>
          {showLiveFeed && isDesktop && (
            <div className="live-feed-display">
              <h3>Live Pose Detection</h3>
              <img
                key={liveFeedKey}
                src={`${liveFeedUrl}?shot_type=${selectedShotType}&t=${Date.now()}`}
                alt="Live Pose Feed"
              />
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="history-section">
        <h3>Previous Results</h3>
        {history.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>Shot Type</th>
                <th>Accuracy</th>
                <th>Feedback</th>
                <th>Shot Mark</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>{item.prediction}</td>
                  <td>{item.accuracy}%</td>
                  <td>{item.feedback}</td>
                  <td>{item.mark}</td>
                  <td>
                    <button className="remove-btn" onClick={() => handleRemoveResult(index)}>
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No previous results found.</p>
        )}
      </div>

      {/* Popup for Angle Feedback */}
      {showPopup && angleFeedback && (
        <div className="popup-box">
          <h3>Angle Feedback for {angleFeedback.shot_type}</h3>
          <ul>
            {Object.entries(angleFeedback.feedback).map(([joint, msg], index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Practice;
