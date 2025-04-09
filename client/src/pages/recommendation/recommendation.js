import React, { useState } from "react";
import "./recommendation.css";

function Recommendation() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [hairstyles, setHairstyles] = useState([]);
  const [error, setError] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (e.g., 2MB limit)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        setError("File size must be less than 2MB.");
        setSelectedImage(null); // Clear selected image
        return;
      }

      setError(""); // Clear any previous error
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleUpload = () => {
    if (selectedImage) {
      alert("Image uploaded successfully! Here are some hairstyle recommendations.");

      // Simulate an API response with different hairstyles
      const simulatedHairstyles = [
        { name: "Curly", imageUrl: "https://via.placeholder.com/200/FF0000/FFFFFF?text=Curly" },
        { name: "Straight", imageUrl: "https://via.placeholder.com/200/00FF00/FFFFFF?text=Straight" },
        { name: "Wavy", imageUrl: "https://via.placeholder.com/200/0000FF/FFFFFF?text=Wavy" },
        { name: "Braided", imageUrl: "https://via.placeholder.com/200/FFA500/FFFFFF?text=Braided" },
        { name: "Pixie Cut", imageUrl: "https://via.placeholder.com/200/800080/FFFFFF?text=Pixie+Cut" },
        { name: "Bob Cut", imageUrl: "https://via.placeholder.com/200/FFFF00/FFFFFF?text=Bob+Cut" },
      ];

      setHairstyles(simulatedHairstyles);
    }
  };

  return (
    <div className="recommendation-container">
      <h1>Hair Recommendation</h1>
      <p>Upload your photo to explore different hairstyles</p>

      <div className="upload-section">
        <label className="upload-btn">
          Choose a Photo
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
      </div>

      {error && <p className="error-message">{error}</p>}

      {selectedImage && (
        <div className="image-preview">
          <h2>Preview:</h2>
          <img src={selectedImage} alt="Uploaded Preview" />
          <button className="upload-btn" onClick={handleUpload}>
            Upload
          </button>
        </div>
      )}

      {hairstyles.length > 0 && (
        <div className="hairstyles-section">
          <h2>Recommended Hairstyles:</h2>
          <div className="hairstyles-grid">
            {hairstyles.map((hairstyle, index) => (
              <div key={index} className="hairstyle">
                <img src={hairstyle.imageUrl} alt={hairstyle.name} />
                <p>{hairstyle.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommendation;