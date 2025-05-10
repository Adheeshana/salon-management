import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import "./EditServiceForm.css";

function EditServiceForm({ service, onUpdate, onCancel }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            sType: service.sType,
            sName: service.sName,
            sPrice: service.sPrice,
            sDescription: service.sDescription
        }
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedService({ ...editedService, [name]: value });
    };

    const handleSubmitForm = (data) => {
        setShowConfirmModal(true);
        setEditedService(data);
    };

    const [editedService, setEditedService] = useState(service);

    const confirmUpdate = () => {
        axios.put(`http://localhost:5000/service/update/${editedService._id}`, editedService)
            .then(() => {
                onUpdate(editedService);
                alert("Service updated successfully");
                setShowConfirmModal(false);
            })
            .catch(error => {
                console.error("Error updating service:", error);
                alert("Error updating service");
                setShowConfirmModal(false);
            });
    };

    const handleCancel = (e) => {
        e.preventDefault();
        onCancel();
    };

    return (
        <>
            <form onSubmit={handleSubmit(handleSubmitForm)} className="edit-service-form">
                <div className="service-form-group">
                    <label htmlFor="sType" className="form-label">Service Type</label>
                    <select 
                        id="sType" 
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

                <div className="service-form-group">
                    <label htmlFor="sName" className="form-label">Service Name</label>
                    <input 
                        type="text" 
                        id="sName" 
                        className="form-control" 
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

                <div className="service-form-group">
                    <label htmlFor="sPrice" className="form-label">Price</label>
                    <input 
                        type="number" 
                        id="sPrice" 
                        className="form-control" 
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

                <div className="service-form-group">
                    <label htmlFor="sDescription" className="form-label">Description</label>
                    <textarea 
                        id="sDescription" 
                        className="form-control" 
                        {...register("sDescription", { 
                            required: "Description is required",
                            minLength: { value: 10, message: "Description must be at least 10 characters" },
                            maxLength: { value: 500, message: "Description cannot exceed 500 characters" }
                        })} 
                        style={{ height: '100px' }}
                    />
                    {errors.sDescription && <span className="text-danger">{errors.sDescription.message}</span>}
                </div>

                <div className="service-form-buttons">
                    <button type="submit" className="btn update-btn">Update</button>
                    <button onClick={handleCancel} className="btn cancel-btn">Cancel</button>
                </div>
            </form>

            {showConfirmModal && (
                <div className="delete-modal">
                    <div className="delete-modal-content">
                        <p>Are you sure you want to update this service?</p>
                        <div>
                            <button onClick={confirmUpdate} className="btn confirm-delete-btn">
                                Confirm Update
                            </button>
                            <button onClick={() => setShowConfirmModal(false)} className="btn cancel-delete-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default EditServiceForm;
