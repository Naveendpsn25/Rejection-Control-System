import {Paper,Typography,TextField,Button,Box} from "@mui/material";

import { useEffect, useState } from "react";

import { Alert } from "@mui/material";

import {getSystemSettings,updateSystemSettings,} from "../../services/authService";

const Settings = () => {

    const [escalationLimit, setEscalationLimit] = useState("");

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {

        const loadSettings = async () => {

            try {

                const data = await getSystemSettings();

                setEscalationLimit(
                    data.escalation_limit
                );

            } catch (error) {

                console.error(error);

            }

        };

        loadSettings();

    }, []);


    const handleSave = async () => {

        try {

            const data = await updateSystemSettings(
                escalationLimit
            );

            setEscalationLimit(
                data.escalation_limit
            );

            setMessage(
                "System settings updated successfully."
            );

            setMessageType("success");

        } catch (error) {

            setMessage(
                error.message
            );

            setMessageType("error");

        }

    };


    return (

        <Paper
            sx={{
                p: 4,
                borderRadius: 3,
            }}
        >
            {
                message && (

                    <Alert
                        severity={messageType}
                        sx={{
                            mb: 3,
                        }}
                    >
                        {message}
                    </Alert>

                )
            }

            <Typography
                variant="h5"
                fontWeight={700}
                mb={3}
                gutterBottom
            >
                System Settings
            </Typography>

            <Box
                sx={{
                    maxWidth: 350,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    
                }}
            >

                <TextField
                    label="Escalation Limit (%)"
                    type="number"
                    fullWidth
                    value={escalationLimit}
                    onChange={(e) =>
                        setEscalationLimit(
                            e.target.value
                        )
                    }
                />

                <Button
                    variant="contained"
                    onClick={handleSave}
                >
                    Save Settings
                </Button>

            </Box>

        </Paper>

    );

};

export default Settings;