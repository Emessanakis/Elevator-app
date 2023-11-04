import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useParams } from 'react-router-dom';
import "./elevator.css"

export default function Elevator() {
    const { capacity, floors } = useParams();
    const [elevatorDirection, setElevatorDirection] = useState('static'); // Start in static mode
    const [currentFloor, setCurrentFloor] = useState(0);
    const [passengerRequests, setPassengerRequests] = useState([]); // Queue for passenger requests
    const [elevatorPassengerCount, setElevatorPassengerCount] = useState(0);
    const [boarding, setBoarding] = useState(false); // State for boarding mode

    const getRandomNumbers = (count) => {
        const randomNumbers = [];
        for (let i = 0; i < count; i++) {
            const randomFloor = Math.floor(Math.random() * parseInt(floors-1)) + 1;
            randomNumbers.push(randomFloor);
        }
        return randomNumbers;
    };
    const moveElevator = () => {
        // Create a counter for requests with the same destinationFloor
        let requestsWithSameDestinationCount = 0;

        if (passengerRequests.length > 0) {
            const nextRequest = passengerRequests[0];

            if (!boarding) {
                if (nextRequest.sourceFloor > currentFloor) {
                    setCurrentFloor(currentFloor + 1);
                    setElevatorDirection('up');
                } else if (nextRequest.sourceFloor < currentFloor) {
                    setCurrentFloor(currentFloor - 1);
                    setElevatorDirection('down');
                } else if (currentFloor === nextRequest.sourceFloor) {
                    setBoarding(true); // Set boarding mode
                }
            } else {
                // Handle boarding logic
                if (nextRequest.destinationFloor > currentFloor) {
                    setCurrentFloor(currentFloor + 1);
                    setElevatorDirection('up');
                } else if (nextRequest.destinationFloor < currentFloor) {
                    setCurrentFloor(currentFloor - 1);
                    setElevatorDirection('down');
                } else if (currentFloor === nextRequest.destinationFloor) {
                    // If the destination is the same as the current floor, handle it
                    if (nextRequest.destinationFloor === currentFloor) {
                        // Check for and remove other requests with the same destinationFloor
                        const remainingRequests = passengerRequests.filter(
                            (req) => req.destinationFloor !== nextRequest.destinationFloor
                        );
                        // Calculate the number of passengers to remove
                        requestsWithSameDestinationCount = passengerRequests.length - remainingRequests.length;
                        // Set new passenger requests
                        setPassengerRequests(remainingRequests);
                        // Exit boarding mode
                        setBoarding(false);
                    }
                }
            }
        } else {
            if (currentFloor !== 0) {
                setCurrentFloor(currentFloor < 0 ? currentFloor + 1 : currentFloor - 1);
                setElevatorDirection('down');
            }
            if (currentFloor === 0) {
                setElevatorDirection('static');
            }
        }

        // Update passenger count by subtracting the count of requests with the same destinationFloor
        setElevatorPassengerCount(elevatorPassengerCount - requestsWithSameDestinationCount);
    };

    // Function to handle passengers entering the elevator
    const addPassenger = (request) => {
        if (elevatorPassengerCount < capacity) {
            // Check if there are no existing passenger requests and the new floor is greater than or equal to the current floor
            if (passengerRequests.length === 0 && request.sourceFloor >= currentFloor) {
                setElevatorPassengerCount(elevatorPassengerCount + 1);
                setPassengerRequests([...passengerRequests, request]);
            } else {
                // Check if the new passenger's requested floor is greater than or equal to the current floor
                if (request.sourceFloor >= currentFloor) {
                    // Check if the new passenger's requested floor is greater than all existing requests
                    const canAddPassenger = passengerRequests.every(req => request.destinationFloor >= req.destinationFloor);

                    if (canAddPassenger) {
                        setElevatorPassengerCount(elevatorPassengerCount + 1);
                        setPassengerRequests([...passengerRequests, request]);
                    } 
                } 
            }
        } 
    }

    // Simulate elevator movement
    useEffect(() => {
        const interval = setInterval(() => {
            moveElevator();
        }, 1000);

        return () => clearInterval(interval);
    });


    const floorButtons = Array.from({ length: parseInt(floors) }, (_, index) => index);

    return (
        <React.Fragment>
            <Box>
                <div className="elevator-wrapper">
                    <div className="elevator-info-container">
                        <h3>Elevator App Parameters</h3>
                        <p>Elevator Capacity: {capacity}</p>
                        <p>Building Floors: {floors}</p>
                    </div>
                    <div className="elevator-container">
                        <Grid container spacing={2}>
                            {floorButtons.map((floor) => (
                                <Grid item key={floor} xs={3}>
                                    <Paper elevation={3} className="floor-paper">
                                        <Typography variant="h6">Floor {floor}</Typography>
                                        <Typography>Direction: {floor === currentFloor ? elevatorDirection : '-'}</Typography>
                                        <Typography>Req. Floor: {floor === currentFloor ? passengerRequests.map(req => `${req.sourceFloor} to ${req.destinationFloor}`).join(', ') : '-'}</Typography>
                                        <Typography>Passengers: {floor === currentFloor ? elevatorPassengerCount : '-'}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        {/* provide some buttons for testing */}
                        <Button variant="contained" onClick={() => {
                            const randomSourceFloors = getRandomNumbers(2);
                            const randomDestinationFloors = getRandomNumbers(2);
                            for (let i = 0; i < 2; i++) {
                                addPassenger({ sourceFloor: randomSourceFloors[0], destinationFloor: randomDestinationFloors[1] });
                            }
                        }}>Add Random Passengers</Button>
                        <Button variant="contained" color="primary" onClick={() => addPassenger({ sourceFloor: 2, destinationFloor: 4 })}>Add Passenger from Floor 2 to 4</Button>
                        <Button variant="contained" color="primary" onClick={() => addPassenger({ sourceFloor: 1, destinationFloor: 3 })}>Add Passenger from Floor 1 to 3</Button>
                    </div>
                </div>
            </Box>
        </React.Fragment>
    );
}
