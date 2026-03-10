import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUpload.css';

const ImageUpload = ({ onImageUpload, loading, disabled }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.bmp', '.tiff']
    },
    multiple: false,
    disabled: disabled
  });

  return (
    <div className="image-upload">
      <h2>Upload Wafer Map</h2>
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <svg 
            className="upload-icon" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          {isDragActive ? (
            <p>Drop the wafer image here...</p>
          ) : (
            <>
              <p>Drag & drop a wafer map image here</p>
              <p className="or-text">or</p>
              <button className="browse-button" type="button">
                Browse Files
              </button>
              <p className="file-types">Supported: PNG, JPG, JPEG, BMP, TIFF</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
