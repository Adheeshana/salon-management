import React, { Component } from 'react';
import axios from 'axios';
import RatingSelect from './RatingSelect';
import Feed_Card from './shared/Feed_Card';
import './CreatePost.css';

const formatDateTime = (date) => {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Colombo'
    };
    return new Date(date).toLocaleString('en-US', options);
};

export default class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            phone: "",
            email: "",
            service: "",
            review: "",
            rating: "",
            date: new Date(),
            errors: {}
        };
    }

    componentDidMount() {
        this.timerID = setInterval(() => {
            this.setState({
                date: new Date()
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        
        this.setState({
            [name]: value
        });
    };

    handleRatingChange = (rating) => {
        this.setState({
            rating
        });
    };

    validateForm = () => {
        const { name, phone, email, service, review } = this.state;
        const errors = {};
        let isValid = true;

        // Check if name contains only letters (including spaces)
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!name) {
            errors.name = "Name is required";
            isValid = false;
        } else if (!nameRegex.test(name)) {
            errors.name = "Name can only contain letters";
            isValid = false;
        }

        if (!phone) {
            errors.phone = "Phone number is required";
            isValid = false;
        } else if (phone.length !== 10 || !/^\d+$/.test(phone)) {
            errors.phone = "Phone number must be exactly 10 digits";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(email)) {
            errors.email = "Please enter a valid email address";
            isValid = false;
        }

        if (!service) {
            errors.service = "Service is required";
            isValid = false;
        }

        if (!review) {
            errors.review = "Review is required";
            isValid = false;
        } else if (/^\d+$/.test(review)) {
            errors.review = "Review cannot contain only numbers";
            isValid = false;
        }

        this.setState({ errors });
        return isValid;
    };

    onSubmit = (e) => {
        e.preventDefault();
        if (!this.validateForm()) return;

        const { name, phone, email, service, review, rating } = this.state;

        const colomboTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' });

        const data = {
            name,
            phone,
            email,
            service,
            review,
            rating,
            date: new Date(colomboTime).toISOString()
        };

        axios.post("http://localhost:5000/post/save", data)
            .then((res) => {
                if (res.data.success) {
                    alert("Feedback submitted successfully");
                    this.setState({
                        name: "",
                        phone: "",
                        email: "",
                        service: "",
                        review: "",
                        rating: "",
                        date: new Date()
                    });
                } else {
                    alert("Submission failed. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error submitting feedback:", error);
                alert("Error submitting feedback. Please try again.");
            });
    };

    render() {
        const { errors } = this.state;

        return (
        <div className='FormBG'>
            <div className='createfeedform'>
                <Feed_Card>
                    <form className="createfeedpost" onSubmit={this.onSubmit}>
                        <h2 className='createfeedpost_header'>How would you rate your service with us?</h2>
                        <RatingSelect select={this.handleRatingChange} selected={this.state.rating} />
                        
                        <div className="createfeedpost_input_group">
                            <input
                                className='createfeed_input'
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                value={this.state.name}
                                onChange={this.handleInputChange}
                            />
                            {errors.name && <span className="error-text" style={{ color: "red" }}>{errors.name}</span>}
                        </div><br />

                        <div className="createfeedpost_input_group">
                            <input
                                className='createfeed_input'
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="Phone number"
                                value={this.state.phone}
                                onChange={this.handleInputChange}
                            />
                            {errors.phone && <span className="error-text" style={{ color: "red" }}>{errors.phone}</span>}
                        </div><br />

                        <div className="createfeedpost_input_group">
                            <input
                                className='createfeed_input'
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={this.state.email}
                                onChange={this.handleInputChange}
                            />
                            {errors.email && <span className="error-text" style={{ color: "red" }}>{errors.email}</span>}
                        </div><br />

                        <div className="createfeedpost_input_group">
                            <select
                                className='createfeedpost_input_group_dropdown'
                                id="service"
                                name="service"
                                value={this.state.service}
                                onChange={this.handleInputChange}
                            >
                                <option value='' disabled>Select a service</option>
                                <option value='Hair Care'>Hair Care</option>
                                <option value='Skin Care'>Skin Care</option>
                                <option value='Nail Care'>Nail Care</option>
                                <option value='Hair Style recommnedation'>Hair Style recommnedation</option>
                            </select>
                            {errors.service && <span className="error-text" style={{ color: "red" }}>{errors.service}</span>}
                        </div><br />

                        <div className="createfeedpost_input_group">
                            <textarea
                                className="createfeedpost_input_group_dropdown_txtarea"
                                id="review"
                                name="review"
                                rows="4"
                                placeholder="Write your review"
                                value={this.state.review}
                                onChange={this.handleInputChange}
                        ></textarea>
                        {errors.review && <span className="error-text" style={{ color: "red" }}>{errors.review}</span>}
                    </div><br />

                    <div className="createfeedpost_input_group">
                        <input
                            className='createfeed_input'
                            type="text"
                            id="date"
                            name="date"
                            value={formatDateTime(this.state.date)}
                            readOnly
                        />
                    </div><br />

                    <button type="submit" className="btnpostsubmit">Submit</button>
                </form>
            </Feed_Card>
        </div>
    </div>
    );
}
}
