import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

function AddService() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [imageError, setImageError] = useState("");
  
  // File size limit - 5MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  function validateImage(file) {
    if (!file) return true;
    
    if (!ACCEPTED_IMAGE_TYPES.includes(file[0]?.type)) {
      setImageError("Only .jpg, .jpeg, .png and .webp formats are accepted");
      return false;
    }
    
    if (file[0]?.size > MAX_FILE_SIZE) {
      setImageError("File size must be less than 5MB");
      return false;
    }
    
    setImageError("");
    return true;
  }

  function sentData(data) {
    if (!validateImage(data.image)) return;

    const formData = new FormData();
    formData.append("sName", data.sName);
    formData.append("sPrice", data.sPrice);
    formData.append("sDescription", data.sDescription);
    formData.append("sType", data.sType);
    formData.append("image", data.image[0]);

    axios.post("http://localhost:5000/service/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        alert("Service added successfully");
        reset();
        setImageError("");
      })
      .catch((err) => {
        if (err.response?.data?.error) {
          alert(err.response.data.error);
        } else {
          console.error("Error:", err);
          alert("An error occurred while adding the service.");
        }
      });
  }

  function onSubmit(data) {
    sentData(data);
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <br />
          <div className="mb-1">
            <label htmlFor="disabledSelect" className="form-label">Service Type</label><br />
            <select 
              id="disabledSelect" 
              className="form-select" 
              {...register("sType", { 
                required: "Service Type is required" 
              })}
            >
              <option value="">Select one</option>
              <option value="Hair care">Hair care</option>
              <option value="Skin care">Skin care</option>
              <option value="Nail care">Nail care</option>
            </select>
            {errors.sType && <span className="text-danger">{errors.sType.message}</span>}
          </div>
          <div className="mb-2">
            <label htmlFor="disabledTextInput1" className="form-label">Service Name</label>
            <input 
              type="text" 
              id="disabledTextInput1" 
              className="form-control" 
              placeholder="Enter service Name"
              {...register("sName", { 
                required: "Service Name is required",
                minLength: { value: 3, message: "Service name must be at least 3 characters" },
                maxLength: { value: 50, message: "Service name cannot exceed 50 characters" },
                pattern: { 
                  value: /^[A-Za-z0-9\s\-&]+$/,
                  message: "Service name can only contain letters, numbers, spaces, hyphens and &" 
                }
              })} 
            />
            {errors.sName && <span className="text-danger">{errors.sName.message}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="disabledTextInput2" className="form-label">Price</label>
            <input 
              type="number" 
              id="disabledTextInput2" 
              className="form-control" 
              placeholder="Enter price"
              {...register("sPrice", { 
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
                max: { value: 100000, message: "Price cannot exceed 100,000" },
                validate: {
                  isNumber: value => !isNaN(value) || "Price must be a valid number",
                  isPositive: value => parseFloat(value) > 0 || "Price must be greater than 0"
                }
              })} 
            />
            {errors.sPrice && <span className="text-danger">{errors.sPrice.message}</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="form-label">Image</label>
            <input 
              type="file" 
              id="image" 
              className="form-control" 
              {...register("image", { 
                required: "Image is required"
              })} 
              onChange={(e) => validateImage(e.target.files)}
            />
            {errors.image && <span className="text-danger">{errors.image.message}</span>}
            {imageError && <span className="text-danger">{imageError}</span>}
          </div>
          <div className="mb-5">
            <label htmlFor="disabledTextInput4" className="form-label">Description</label>
            <textarea 
              type="text" 
              id="disabledTextInput4" 
              className="form-control" 
              placeholder="Enter description"
              {...register("sDescription", { 
                required: "Description is required",
                minLength: { value: 10, message: "Description must be at least 10 characters" },
                maxLength: { value: 500, message: "Description cannot exceed 500 characters" }
              })} 
              style={{ height: '100px' }} 
            />
            {errors.sDescription && <span className="text-danger">{errors.sDescription.message}</span>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ margin: "0 auto", display: "block", width: "300px" }}>Submit</button>
        </fieldset>
      </form>
    </div>
  )
}

export default AddService;
