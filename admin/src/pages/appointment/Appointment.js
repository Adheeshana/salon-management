import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthToken } from '../../auth';
import { useNavigate } from "react-router-dom";
import './Appointment.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function Appointment() {
    var token = useAuthToken();
    var navigate = useNavigate();
    const [originalAppointmentData, setOriginalAppointmentData] = useState([]);
    const [filteredAppointmentData, setFilteredAppointmentData] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        if (token != null) {
            axios.post("http://localhost:5000/appointment/admin_get", { token: token }).then((response) => {
                var data = response.data;
                var status = data.status;
                if (status === "success") {
                    const appointments = data.data;
                    setOriginalAppointmentData(appointments);
                    setFilteredAppointmentData(appointments);
                } else if (status === "token_expired" || status === "auth_failed") {
                    navigate("/signout");
                } else {
                    var message = data.message;
                    alert("Error - " + message);
                }
            }).catch((error) => {
                alert("Error 2 - " + error);
            });
        } else {
            navigate("/signout");
        }
    }, [token, navigate]);

    useEffect(() => {
        // Filter appointment data based on search text
        const filteredData = originalAppointmentData.filter(appointment =>
            appointment.appointment_id.toLowerCase().includes(searchText.toLowerCase()) ||
            appointment.service.toLowerCase().includes(searchText.toLowerCase()) ||
            appointment.name.toLowerCase().includes(searchText.toLowerCase()) ||
            appointment.date.toLowerCase().includes(searchText.toLowerCase()) ||
            appointment.time.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredAppointmentData(filteredData);
    }, [originalAppointmentData, searchText]);

    function searchAppointment() {
        // Trigger search by updating the searchText state
        setSearchText(searchText.trim());
    }

    const sortData = (key) => {
        const sortedData = [...filteredAppointmentData].sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
        setFilteredAppointmentData(sortedData);
    };

    // Function to generate PDF report for current data
    const generateCurrentReport = () => {
        const doc = new jsPDF();

        // Add report title
        doc.setFontSize(16);
        doc.text("Current Appointment Report", doc.internal.pageSize.getWidth() / 2, 20, 'center');

        // Filtered appointment data based on search text
        const filteredData = originalAppointmentData.filter(appointment =>
            appointment.appointment_id.toLowerCase().includes(searchText.toLowerCase()) ||
            appointment.service.toLowerCase().includes(searchText.toLowerCase()) ||
            appointment.name.toLowerCase().includes(searchText.toLowerCase()) ||
            appointment.date.toLowerCase().includes(searchText.toLowerCase()) ||
            appointment.time.toLowerCase().includes(searchText.toLowerCase())
        );

        // Generate report content from filtered appointments data
        doc.autoTable({
            head: [['Appointment ID', 'Service Name', 'Date', 'Time', 'Stylist Name']],
            body: filteredData.map(appointment => [appointment.appointment_id, appointment.service, appointment.date, appointment.time, appointment.name]),
            theme: 'plain', 
            headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }, 
            alternateRowStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0] } // Set styles for alternate rows
        });

        doc.save('appointment_report.pdf');
    };

    return (
        <div className="appointment-list-container">
            <h1>Manage Appointment</h1>
            <div className='appointment-filter-bar'>
                <input 
                    className='appointment-filter-search' 
                    value={searchText} 
                    onChange={(e) => setSearchText(e.target.value)} 
                    placeholder="Search appointment" 
                    type="text" 
                />
                <button className='appointment-filter-search-btn' onClick={searchAppointment}>Search</button>
                <button className='generate_creport_btn' onClick={generateCurrentReport}>Generate Current Report</button>
            </div>

            <table className="appointment-table">
                <thead>
                    <tr>
                        <th onClick={() => sortData('appointment_id')}>Appointment ID</th>
                        <th onClick={() => sortData('service')}>Service Name</th>
                        <th onClick={() => sortData('date')}>Date</th>
                        <th onClick={() => sortData('time')}>Time</th>
                        <th onClick={() => sortData('name')}>Stylist Name</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAppointmentData.map((appointment, index) => (
                        <tr key={index}>
                            <td>{appointment.appointment_id}</td>
                            <td>{appointment.service}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.time}</td>
                            <td>{appointment.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Appointment;
