import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    MenuItem,
    Grid,
} from "@mui/material";

import { registerUser } from "../../services/authService";

import { useNavigate } from "react-router-dom";

import { useState } from "react";

const Signup = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [firstName, setFirstName] = useState("");

    const [lastName, setLastName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [role, setRole] = useState("OPERATOR");

    const [errors, setErrors] = useState({});

    const validateForm = () => {

        const newErrors = {};

        if (!username.trim()) {

            newErrors.username = "Username is required.";

        }

        if (!firstName.trim()) {

            newErrors.firstName = "First name is required.";

        }

        if (!lastName.trim()) {

            newErrors.lastName = "Last name is required.";

        }

        if (!email.trim()) {

            newErrors.email = "Email is required.";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {

            newErrors.email = "Enter a valid email address.";

        }

        if (!password) {

            newErrors.password = "Password is required.";

        } else if (password.length < 6) {

            newErrors.password =
                "Password must be at least 6 characters.";

        }

        if (!confirmPassword) {

            newErrors.confirmPassword =
                "Confirm password is required.";

        } else if (
            password !== confirmPassword
        ) {

            newErrors.confirmPassword =
                "Passwords do not match.";

        }


        if (!role) {

                newErrors.role = "Please select a role.";

            }

        setErrors(newErrors);
        

        return Object.keys(newErrors).length === 0;

    };

    const handleSubmit = async () => {

         if (!validateForm()) {
            return;
        }

        try {

            await registerUser({

                username,

                first_name: firstName,

                last_name: lastName,

                email,

                password,

                confirm_password: confirmPassword,

                role,

            });

            // alert("Registration successful!");

            navigate("/login");

        } catch (error) {

            alert(error.message);

        }

    };
    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f4f6f8",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    width: 430,
                    p: 4,
                    borderRadius: 4,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight={700}
                    textAlign="center"
                    color="primary"
                    mb={3}
                >
                    Rejection Management
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        color: "#413e3e",
                        fontWeight: 400,
                        // mb: 4,
                    }}
                >
                    Sign up to access the Rejection Control System
                </Typography>

               <TextField
                    fullWidth
                    label="Username"
                    margin="dense"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={!!errors.username}
                    helperText={errors.username}
                />

                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            margin="dense"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                        />
                    </Grid>

                    <Grid size={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            margin="dense"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                        />
                    </Grid>
                </Grid>

                <TextField
                    fullWidth
                    label="Email"
                    margin="dense"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                />

                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid size={6}>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            margin="dense"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                    </Grid>

                    <Grid size={6}>
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            margin="dense"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                        />
                    </Grid>
                </Grid>

               <TextField
                    fullWidth
                    select
                    label="Role"
                    margin="dense"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    error={!!errors.role}
                    helperText={errors.role}
                >
                    <MenuItem value="OPERATOR">
                        Operator
                    </MenuItem>

                    <MenuItem value="SUPERVISOR">
                        Supervisor
                    </MenuItem>
                </TextField>

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                        mt: 3,
                        py: 1.3,
                        fontWeight: 600,
                        mb:2
                    }}

                    onClick={handleSubmit}
                    
                >
                    Sign Up
                </Button>

                <Typography
                    textAlign="center"
                    mt={2}
                    fontSize={14}
                >
                    Already have an account?{" "}
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </Button>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Signup;