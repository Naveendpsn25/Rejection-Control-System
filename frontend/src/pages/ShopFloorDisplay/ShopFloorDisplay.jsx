import {Box,Typography,Paper} from "@mui/material";

import {ResponsiveContainer,LineChart,Line,CartesianGrid, XAxis, YAxis, Tooltip} from "recharts";

import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../services/dashboardService";

const ShopFloorDisplay = () => {

    const currentDateTime = new Date().toLocaleString();

     const [summary, setSummary] = useState(null);

   const trendData =  summary?.trend ?? [];

   

        useEffect(() => {

            const loadDashboardSummary = async () => {

                try {

                    const data = await getDashboardSummary();
                    setSummary(data);

                } catch (error) {

                    console.error(error);

                }

            };

            // Initial Load
            loadDashboardSummary();

            // Auto Refresh every 20 seconds
            const interval = setInterval(() => {

                loadDashboardSummary();

            }, 20000);

            return () => clearInterval(interval);

        }, []);

    return (

        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#0F172A",
                p: 3,
            }}
        >

            <Paper
                elevation={3}
                sx={{
                    bgcolor: "#1E293B",
                    color: "#fff",
                    borderRadius: 3,
                    px: 4,
                    py: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                }}
            >

                {/* Left */}

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        QUALITY ANDON
                    </Typography>

                    <Typography
                        sx={{
                            color: "#CBD5E1",
                            mt: 0.5,
                        }}
                    >
                        Rejection Monitoring Dashboard
                    </Typography>

                </Box>

                {/* Right */}

                <Box
                    sx={{
                        textAlign: "right",
                    }}
                >

                    <Typography
                        fontWeight={600}
                        fontSize={18}
                    >
                        {currentDateTime}
                    </Typography>

                    <Typography
                        sx={{
                            color: "#22C55E",
                            mt: 0.5,
                        }}
                    >
                        ● Auto Refresh : 20 Seconds
                    </Typography>

                </Box>

            </Paper>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(5, 1fr)",
                    },
                    gap: 3,
                    mb: 4,
                }}
            >

                {[
                    {
                        title: "Today's Produced",
                        value: summary?.today_produced ?? 0,
                        color: "#3B82F6",
                    },
                    {
                        title: "Today's Rejected",
                        value: summary?.today_rejected ?? 0,
                        color: "#EF4444",
                    },
                    {
                        title: "Rejection %",
                        value: `${summary?.rejection_percentage ?? 0}%`,
                        color: "#F59E0B",
                    },
                    {
                        title: "Pending Approvals",
                        value: summary?.pending_supervisor,
                        color: "#8B5CF6",
                    },
                    {
                        title: "CAPA Open",
                        value: summary?.capa_open ?? 0,
                        color: "#10B981",
                    },
                ].map((card) => (

                    <Paper
                        key={card.title}
                        elevation={4}
                        sx={{
                            bgcolor: "#1E293B",
                            borderRadius: 3,
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            minHeight: 130,
                            transition: "0.25s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 8,
                            },
                        }}
                    >

                        <Typography
                            sx={{
                                color: "#94A3B8",
                                fontSize: 14,
                                fontWeight: 500,
                            }}
                        >
                            {card.title}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 2,
                                fontSize: 36,
                                fontWeight: 700,
                                color: card.color,
                            }}
                        >
                            {card.value}
                        </Typography>

                    </Paper>

                ))}

            </Box>
            <Box
    sx={{
        display: "grid",
        gridTemplateColumns: {
            xs: "1fr",
            lg: "3fr 1fr",
        },
        gap: 3,
    }}
>

    {/* Graph */}

    <Paper
        elevation={4}
        sx={{
            bgcolor: "#1E293B",
            borderRadius: 3,
            p: 3,
        }}
    >

        <Typography
            variant="h6"
            fontWeight={700}
            color="white"
            mb={3}
        >
            Today's Rejection Trend
        </Typography>

        <ResponsiveContainer
            width="100%"
            height={350}
        >

            <LineChart data={trendData}>

                <CartesianGrid
                    strokeDasharray="5 5"
                    stroke="#334155"
                />

                <XAxis
                    dataKey="time"
                    stroke="#CBD5E1"
                />

                <YAxis
                    stroke="#CBD5E1"
                    unit="%"
                />

                <Tooltip
                    formatter={(value) => [
                        `${value}%`,
                        "Rejection",
                    ]}
                />

                <Line
                    type="linear"
                    dataKey="rejection_percentage"
                    stroke="#FACC15"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                />

            </LineChart>

        </ResponsiveContainer>

    </Paper>

    {/* Pending Tasks */}

    <Paper
        elevation={4}
        sx={{
            bgcolor: "#1E293B",
            borderRadius: 3,
            p: 3,
        }}
    >

        <Typography
            variant="h6"
            fontWeight={700}
            color="white"
            mb={3}
        >
            Pending Tasks
        </Typography>

        {[
            {
                title: "Supervisor Approvals",
                value: summary?.supervisor_approvals ?? 0,
                color: "#EF4444",
            },
            {
                title: "CAPA Submission",
                value: summary?.capa_submission ?? 0,
                color: "#F59E0B",
            },
            {
                title: "CAPA Rejected",
                value: summary?.capa_rejected ?? 0,
                color: "#DC2626",
            },
        ].map((task) => (

            <Paper
                key={task.title}
                sx={{
                    bgcolor: "#0F172A",
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                }}
            >

                <Typography
                    color="#73869c"
                    fontSize={14}
                >
                    {task.title}
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        fontWeight: 700,
                        fontSize: 30,
                        color: task.color,
                    }}
                >
                    {task.value}
                </Typography>

            </Paper>

        ))}

    </Paper>

</Box>
        </Box>

    );

};

export default ShopFloorDisplay;