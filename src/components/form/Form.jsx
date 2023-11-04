import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import "./form.css";

export default function Form() {
    const [formData, setFormData] = useState({
        capacity: "",
        floors: "",
    });

    const [errors, setErrors] = useState({
        capacity: "",
        floors: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let error = "";

        if (name === "capacity") {
            if (!/^\d+$/.test(value) || parseInt(value) < 1 || parseInt(value) > 10) {
                error = "Invalid input. Please enter a positive number between 1 and 10 for Elevator-Capacity.";
            }
        } else if (name === "floors") {
            if (!/^\d+$/.test(value) || parseInt(value) < 5 || parseInt(value) > 100) {
                error = "Invalid input. Please enter a positive number between 5 and 100 for Building-Floors.";
            }
        }

        setFormData({
            ...formData,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: error,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (errors.capacity === "" && errors.floors === "") {
            const url = `/Elevator/${formData.capacity}/${formData.floors}`;
            window.location.href = url; 
        } else {
            console.log("Form submission failed. Please correct errors.");
        }
    }

    return (
        <React.Fragment>
            <Box>
                <div className="form-wrapper">
                    <form className="form-container" onSubmit={handleSubmit}>
                        <div className="params-form">
                            <h3>Set the params for the elevator app</h3>
                            <TextField
                                className="textfields"
                                required
                                label="Elevator-Capacity"
                                variant="standard"
                                type="text"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleInputChange}
                            />
                            <div className="errors">
                                {errors.capacity && <Typography color="error">{errors.capacity}</Typography>}
                            </div>
                            <TextField
                                className="textfields"
                                required
                                label="Building-Floors"
                                variant="standard"
                                type="text"
                                name="floors"
                                value={formData.floors}
                                onChange={handleInputChange}
                            />
                            <div className="errors">
                                {errors.floors && <Typography color="error">{errors.floors}</Typography>}
                            </div>
                            <div className="button-wrapper">
                                <Button
                                    type="submit"
                                    variant="contained"
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </Box>
        </React.Fragment>
    );
}
