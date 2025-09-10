import React, { useState, useRef } from "react";
import "../Styles/upload.css";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Upload() {
  const [formData, setFormData] = useState({
    problemType: "",
    description: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.problemType || !formData.description || !formData.photo) {
      alert("Please fill all fields and take/upload a photo!");
      return;
    }

    // Here you can send the formData to backend API
    console.log("Submitted Data:", formData);
    alert("Problem uploaded successfully!");

    // Reset form
    setFormData({ problemType: "", description: "", photo: null });
    setPreview(null);
  };

  return (
    <div className="body123">
      <div className="container">
        <h1>REPORT PUBLIC PROPERTY DAMAGE</h1>

        <label>Problem Type:</label>
        <select
          name="problemType"
          value={formData.problemType}
          onChange={handleChange}
        >
          <option value="">Select Problem</option>
          <option>Pothole</option>
          <option>Traffic Signals</option>
          <option>Dividers</option>
          <option>Pipelines</option>
          <option>Drainage</option>
          <option>Street Light</option>
          <option>Public Tap</option>
          <option>Others</option>
        </select>

        <label>Description:</label><br></br><br/>
        <TextField
      id="standard-textarea"
      label=""
      placeholder="Describe the problem..."
      multiline
      variant="standard"
      // Custom styles
      sx={{
        width: "90%",        // increase width
        "& .MuiInputBase-root": {
          color: "grey",      // text color
        },
        "& .MuiInput-underline:before": {
          borderBottomColor: "gray", // underline default color
        },
        "& .MuiInput-underline:hover:before": {
          borderBottomColor: "white", // underline on hover
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "white", // underline on focus
        },
      }}
    />
        <div className="upload-box" onClick={handleCameraClick}>
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
            />
          ) : (
            <span style={{ color: "rgb(136, 129, 129)", textDecoration: "underline" }}>
              Take a Photo / Upload
            </span>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <br></br><br></br>
        <button onClick={handleSubmit}>Submit</button>
        <button
          type="reset"
          onClick={() => {
            setFormData({ problemType: "", description: "", photo: null });
            setPreview(null);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
