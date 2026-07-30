import { NavLink } from "react-router-dom";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getCAPACount } from "../../services/authService";


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
  const [capaCount, setCapaCount] = useState(0);

  const loadCount = async () => {

    try {

        const data = await getCAPACount();

        setCapaCount(data.count);

    } catch (error) {

        console.error(error);

    }

};



  useEffect(() => {

    const initialize = async () => {

        await loadCount();

    };

    initialize();

}, []);


  useEffect(() => {

    const refresh = () => {

        loadCount();

    };

    window.addEventListener(
        "capaUpdated",
        refresh
    );

    return () => {

        window.removeEventListener(
            "capaUpdated",
            refresh
        );

    };

}, []);


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
        display: "flex",
        alignItems: "center",
        height: "100%",
        padding: "0 16px",
        fontWeight: 600,
        borderBottom: isActive
            ? "3px solid #d84315"
            : "3px solid transparent",
    })}
>

    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
        }}
    >

        <span>{item.name}</span>

        {item.name === "CAPA" && capaCount > 0 && (

            <Box
                sx={{
                    minWidth: 20,
                    height: 20,
                    px: 0.8,
                    bgcolor: "#c0392b",
                    color: "#fff",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                }}
            >
                {capaCount}
            </Box>

        )}

    </Box>

</NavLink>
      ))}
    </Box>
  );
}