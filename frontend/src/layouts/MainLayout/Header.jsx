import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

import useAuthStore from "../../store/authStore";

const Header = () => {
    const { user } = useAuthStore();

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                backgroundColor: "#1E2733",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
        >
            <Toolbar
                sx={{
                    height: "68px",
                    minHeight: "68px !important",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 3,
                }}
            >
                {/* Left Side */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#fff",
                            fontSize: "18px",
                            fontWeight: 800,
                            letterSpacing: "1px",
                            lineHeight: 1.2,
                            textTransform: "uppercase",
                        }}
                    >
                        REJECTION CONTROL SYSTEM
                    </Typography>

                    <Typography
                        sx={{
                            color: "#B8C3CF",
                            fontSize: "13px",
                            mt: "2px",
                            ml: "2px",
                        }}
                    >
                        Endotherm Fluids · Chennai Plant
                    </Typography>
                </Box>

                {/* Right Side */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <IconButton
                        sx={{
                            width: 42,
                            height: 42,
                            border: "1px solid rgba(255,255,255,.15)",
                            color: "#FFC107",
                            borderRadius: 2,
                        }}
                    >
                        <NotificationsIcon fontSize="small" />
                    </IconButton>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            lineHeight: 1.2,
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#FFFFFF",
                                fontSize: "14px",
                            }}
                        >
                            Logged in as
                        </Typography>

                        <Box
                            sx={{
                                backgroundColor: "#fff",
                                px: 2.5,
                                py: 1,
                                borderRadius: 1,
                                border: "1px solid #d5dbe3",
                                minWidth: 150,
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: 15,
                                    color: "#1f2937",
                                    textTransform: "uppercase",
                                }}
                            >
                                {user?.role}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;