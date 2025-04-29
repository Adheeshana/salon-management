import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

function AddOffer() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [discountError, setDiscountError] = useState("");
  const [imageError, setImageError] = useState("");
  
  // File size limit - 2MB
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  function validateImage(file) {
    if (!file) return true;
    
    if (!ACCEPTED_IMAGE_TYPES.includes(file[0]?.type)) {
      setImageError("Only .jpg, .jpeg, .png and .webp formats are accepted");
      return false;
    }
    
    if (file[0]?.size > MAX_FILE_SIZE) {
      setImageError("File size must be less than 2MB");
      return false;
    }
    
    setImageError("");
    return true;
  }

  function sentData(data) {
    const formData = new FormData();
    formData.append("sName", data.sName);
    formData.append("sDiscount", data.sDiscount);
    formData.append("sDescription", data.sDescription);
    formData.append("image", data.image[0]); 
  
    axios.post("http://localhost:5000/offer/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        alert("Offer added successfully!");
        reset();
      })
      .catch((err) => {
        if (err.response?.data?.error) {
          alert(err.response.data.error);
        } else {
          console.error("Error:", err);
          alert("An error occurred while adding the offer.");
        }
      });
  }

  function onSubmit(data) {
    if (!validateImage(data.image)) {
      return;
    }
    sentData(data);
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)} className="offer-form">
        <fieldset>
          <br />
          <div className="mb-2">
            <label htmlFor="disabledTextInput1" className="form-label">Service Name</label>
            <input 
              type="text" 
              id="disabledTextInput1" 
              className="form-control" 
              placeholder="Enter service name"
              {...register("sName", { 
                required: "Service name is required",
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
            <label htmlFor="disabledTextInput2" className="form-label">Discount Percentage</label>
            <input 
              type="number" 
              id="disabledTextInput2" 
              className="form-control" 
              placeholder="Enter discount percentage"
              {...register("sDiscount", { 
                required: "Discount is required",
                min: { value: 0, message: "Discount cannot be negative" },
                max: { value: 100, message: "Discount cannot exceed 100%" },
                validate: {
                  isNumber: value => !isNaN(value) || "Discount must be a valid number",
                  isInteger: value => Number.isInteger(Number(value)) || "Discount must be a whole number"
                }
              })} 
            />
            {errors.sDiscount && <span className="text-danger">{errors.sDiscount.message}</span>}
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="form-label">Image</label>
            <input 
              type="file" 
              id="image" 
              className="form-control" 
              accept=".jpg,.jpeg,.png,.webp"
              {...register("image", { 
                required: "Image is required"
              })} 
            />
            {errors.image && <span className="text-danger">{errors.image.message}</span>}
            {imageError && <span className="text-danger">{imageError}</span>}
          </div>

          <div className="mb-5">
            <label htmlFor="disabledTextInput4" className="form-label">Description</label>
            <textarea 
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

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </fieldset>
      </form>
    </div>
  );
}

export default AddOffer;
