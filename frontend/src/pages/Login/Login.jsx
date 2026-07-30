import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import { loginSchema } from "../../validations/authValidation";
import { login } from "../../services/authService";
import useAuthStore from "../../store/authStore";

import {
    setAccessToken,
    setRefreshToken,
} from "../../utils/token";



const Login = () => {
    const navigate = useNavigate();

    const { login: loginUser } = useAuthStore();

    const {register,handleSubmit,formState: { errors },} = useForm({resolver: zodResolver(loginSchema),});

    const loginMutation = useMutation({
        mutationFn: login,

        onSuccess: (data) => {
            setAccessToken(data.access);
            setRefreshToken(data.refresh);

            loginUser(data.user);

            navigate("/entry");
        },

        onError: (error) => {
            console.error(error.message);
        },
    });


    const onSubmit = (data) => {
        loginMutation.mutate(data);
    };

    return (
    <Box
        sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #eef2f7 0%, #dbe9f4 100%)",
            padding: 2,
        }}
    >
        <Paper
            elevation={10}
            sx={{
                width: 420,
                borderRadius: 4,
                p: 5,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 4,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                >
                    Rejection Control
                </Typography>

                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    textAlign="center"
                >
                    Manufacturing Quality Management System
                </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>

                <TextField
                    label="Username"
                    placeholder="Enter your username"
                    fullWidth
                    margin="normal"
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                />

                <TextField
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    fullWidth
                    margin="normal"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />

               {loginMutation.isError && (
                    <Typography
                        variant="body2"
                        color="error"
                        textAlign="center"
                        sx={{ mt: 2 }}
                    >
                        {loginMutation.error.message}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                        mt: 1,
                        // py: 1.5,
                        borderRadius: 2,
                        fontWeight: "bold",
                        textTransform: "none",
                        fontSize: "16px",
                    }}
                    disabled={loginMutation.isPending}
                    
                >
                    {loginMutation.isPending
                        ? "Signing In..."
                        : "Login"}
                </Button>

                <Typography
                    textAlign="center"
                    mt={5}
                    fontSize={14}
                    sx={{
                        mt:2
                    }}
                >
                    Don't have an account?{" "}

                    <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate("/")}
                    >
                        Register
                    </Button>

                </Typography>

            </form>

        </Paper>
    </Box>
);

};

export default Login;