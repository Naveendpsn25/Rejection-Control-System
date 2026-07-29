import { NavLink } from "react-router-dom";
import { Box } from "@mui/material";

const links = [
  {
    name: "New Entry",
    path: "/entry",
  },
  {
    name: "Approvals",
    path: "/approvals",
  },
  {
    name: "CAPA",
    path: "/capa",
  },
  {
    name: "Trends",
    path: "/trends",
  },
  {
    name: "Stores",
    path: "/stores",
  },
  {
    name: "Shop Floor Display",
    path: "/shop-floor-display",
  },
  {
    name: "Settings",
    path: "/settings",
  },
];

export default function Navbar() {
  return (
    <Box
      sx={{
        height: 56,
        bgcolor: "white",
        display: "flex",
        alignItems: "center",
        px: 3,
        borderBottom: "1px solid #ddd",
      }}
    >
      {links.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#111" : "#5d6875",
            padding: "16px 14px",
            fontWeight: 600,
            borderBottom: isActive
              ? "3px solid #d84315"
              : "3px solid transparent",
            transition: ".2s",
          })}
        >
          {item.name}
        </NavLink>
      ))}
    </Box>
  );
}