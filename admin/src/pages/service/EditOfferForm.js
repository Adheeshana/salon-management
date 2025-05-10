import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import "./EditOfferForm.css";

function EditOfferForm({ offer, onUpdate, onCancel }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            sName: offer.sName,
            sDiscount: offer.sDiscount,
            sDescription: offer.sDescription
        }
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [editedOffer, setEditedOffer] = useState(offer);

    const handleSubmitForm = (data) => {
        setShowConfirmModal(true);
        setEditedOffer(data);
    };

    const confirmUpdate = () => {
        axios.put(`http://localhost:5000/offer/update/${offer._id}`, editedOffer)
            .then(() => {
                onUpdate(editedOffer);
                alert("Offer updated successfully");
                setShowConfirmModal(false);
            })
            .catch(error => {
                console.error("Error updating offer:", error);
                alert("Error updating offer");
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
                    <label htmlFor="sName" className="form-label">Service Name</label>
                    <input 
                        type="text" 
                        id="sName" 
                        className="form-control" 
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

                <div className="service-form-group">
                    <label htmlFor="sDiscount" className="form-label">Discount Percentage</label>
                    <input 
                        type="number" 
                        id="sDiscount" 
                        className="form-control" 
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
                        <p>Are you sure you want to update this offer?</p>
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

export default EditOfferForm;
