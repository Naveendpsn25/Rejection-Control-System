import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Select,
  MenuItem,
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
        backgroundColor: "#1b2532",
        height: 58,
        justifyContent: "center",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: "58px !important",
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: 1,
            }}
          >
            REJECTION CONTROL SYSTEM
          </Typography>

          <Typography
            sx={{
              ml: 3,
              color: "#b5bec8",
              fontSize: 15,
            }}
          >
            Endotherm Fluids · Chennai Plant
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            sx={{
              color: "#ffd54f",
              border: "1px solid rgba(255,255,255,.2)",
            }}
          >
            <NotificationsIcon />
          </IconButton>

          <Typography color="#d6dde5">
            Logged in as
          </Typography>

          <Select
            value={user?.role || ""}
            size="small"
            sx={{
              bgcolor: "white",
              minWidth: 150,
              fontWeight: 600,
            }}
          >
            <MenuItem value={user?.role}>
              {user?.role}
            </MenuItem>
          </Select>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;