import { useEffect, useState } from "react";

import { getCAPAs ,submitCAPA,approveRejectCAPA} from "../../services/authService";

import {Box,Paper,Typography,Grid,Button,TextField} from "@mui/material";

import useAuthStore from "../../store/authStore";


const CAPA = () => {

    const [capas, setCapas] = useState([]);
    const [selectedCAPA, setSelectedCAPA] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const [rootCause, setRootCause] = useState("");

    const [correctiveAction, setCorrectiveAction] = useState("");

    const [preventiveAction, setPreventiveAction] = useState("");

    const [assignedTo, setAssignedTo] = useState("");

    const [targetDate, setTargetDate] = useState("");

    const [reportFile, setReportFile] = useState(null);

    const { user } = useAuthStore();

    const isSupervisor = user?.role === "SUPERVISOR";

    console.log(user);
    console.log(isSupervisor);

    useEffect(() => {

        const loadCAPAs = async () => {

            try {

                const data = await getCAPAs();

                setCapas(data);
                // console.log(JSON.stringify(data, null, 2));

            } catch (error) {

                console.error(error);

            }

        };

        loadCAPAs();

    }, []);


    const handleCAPASubmit = async () => {

        if (
            !rootCause.trim() ||
            !correctiveAction.trim() ||
            !preventiveAction.trim()
        ) {

            setErrorMessage(
                "Root cause, corrective action and preventive action are required."
            );

            return;

        }

        try {

            const formData = new FormData();

            formData.append(
                "root_cause",
                rootCause
            );

            formData.append(
                "corrective_action",
                correctiveAction
            );

            formData.append(
                "preventive_action",
                preventiveAction
            );

           


            formData.append(
                "target_date",
                targetDate
            );

            if (reportFile) {

                formData.append(
                    "report",
                    reportFile
                );

            }

            await submitCAPA(
                selectedCAPA.id,
                formData
            );

            alert("CAPA submitted successfully.");

            // Reload the CAPA list
            const updatedCAPAs = await getCAPAs();
            setCapas(updatedCAPAs);

            // Close the form
            setSelectedCAPA(null);

            // Clear all form fields
            setRootCause("");
            setCorrectiveAction("");
            setPreventiveAction("");
            setAssignedTo("");
            setTargetDate("");
            setReportFile(null);
            setErrorMessage("");

        } catch (error) {

            // console.error(error);

            setErrorMessage(
                "Failed to submit CAPA."
            );

        }

    };


    const handleApproval = async (id, action) => {

        try {

            await approveRejectCAPA(id, action);

            const updatedCAPAs = await getCAPAs();

            setCapas(updatedCAPAs);

            alert(
                action === "APPROVE"
                    ? "CAPA approved successfully."
                    : "CAPA rejected successfully."
            );

        } catch (error) {

            console.error(error);

            alert("Failed to update CAPA.");

        }

};


    const openCAPAs = capas.filter(
        (capa) => capa.status === "OPEN"
    );

    const submittedCapas = capas.filter(
        (capa) => capa.status === "IN_PROGRESS"
    );

       return (
    <Box
        sx={{
            backgroundColor: "#eef2f6",
            minHeight: "100vh",
            p: 4,
        }}
    >

        {errorMessage && (

        <Paper
            sx={{
                mb: 3,
                bgcolor: "#fdecea",
                color: "#b71c1c",
                border: "1px solid #f5c2c7",
                px: 3,
                py: 2,
                borderRadius: 2,
                fontWeight: 600,
            }}
        >
            {errorMessage}
        </Paper>

    )}

        {!selectedCAPA ? (
            <>

                <Typography
                    sx={{
                        color: "#5f6f85",
                        mb: 3,
                        fontSize: 17,
                    }}
                >
                    A CAPA opens automatically when any rejection exceeds the
                    3% limit. Production must submit within 3 days.
                </Typography>

                <Paper
                    elevation={1}
                    sx={{
                        borderRadius: 3,
                        p: 3,
                        border: "1px solid #dfe7ef",
                    }}
                >

                    {/* HEADER */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: 24,
                                letterSpacing: 1,
                            }}
                        >
                            OPEN — ACTION PENDING FROM PRODUCTION
                        </Typography>

                        <Box
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: 1,
                                bgcolor: "#fdeceb",
                                color: "#d84315",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                            }}
                        >
                            {openCAPAs.length}
                        </Box>
                    </Box>

                    {openCAPAs.map((capa) => (
                        

                        <Paper
                            key={capa.id}
                            variant="outlined"
                            sx={{
                                mb: 0,
                                p: 2,
                                borderRadius: 2,
                                borderColor: "#d9e3ec",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        flexWrap: "wrap",
                                    }}
                                >

                                    {/* PART NUMBER */}

                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: 22,
                                        }}
                                    >
                                        {capa.part_number}
                                    </Typography>

                                    {/* Department */}

                                    <Typography
                                        sx={{
                                            color: "#5f6f85",
                                            fontSize: 18,
                                        }}
                                    >
                                        {capa.department}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: "#b0b0b0",
                                        }}
                                    >
                                        •
                                    </Typography>

                                    {/* Defect */}

                                    <Typography
                                        sx={{
                                            color: "#5f6f85",
                                            fontSize: 18,
                                        }}
                                    >
                                        {capa.defect_type}
                                    </Typography>

                                    {/* Due */}

                                    <Box
                                        sx={{
                                            bgcolor: "#eaf4ff",
                                            border: "1px solid #b8d5ff",
                                            px: 2,
                                            py: .5,
                                            borderRadius: 1,
                                            fontWeight: 600,
                                            color: "#1565c0",
                                            fontSize: 15,
                                        }}
                                    >
                                        Due {capa.target_date}
                                    </Box>

                                </Box>

                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        setSelectedCAPA(capa)
                                    }
                                    sx={{
                                        bgcolor: "#1d2b3a",
                                        px: 3,
                                        py: 1,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        fontSize: 16,
                                    }}
                                >
                                    Fill CAPA report
                                </Button>

                            </Box>

                        </Paper>

                    ))}

                </Paper>

            </>
        ) : (
            <Grid container spacing={3}>

    <Grid size={{ xs: 12 }}>

        <TextField
            multiline
            rows={4}
            label="Root Cause"
            fullWidth
            value={rootCause}
            onChange={(e) => {

                setRootCause(e.target.value);

                setErrorMessage("");

            }}
        />

    </Grid>

    <Grid size={{ xs: 12 }}>

        <TextField
            multiline
            rows={4}
            label="Corrective Action"
            fullWidth
            value={correctiveAction}
            onChange={(e) => {

                setCorrectiveAction(e.target.value);

                setErrorMessage("");

            }}
        />

    </Grid>

    <Grid size={{ xs: 12 }}>

        <TextField
            multiline
            label="Preventive action"
            rows={4}
            fullWidth
            value={preventiveAction}
            onChange={(e) => {

                setPreventiveAction(e.target.value);

                setErrorMessage("");

            }}
        />

    </Grid>

    <Grid size={{ xs: 4 }}>

        <TextField
            label="Responsible"
            fullWidth
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
        />

    </Grid>

    <Grid size={{ xs: 4 }}>

        <TextField
            type="date"
            fullWidth
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            InputLabelProps={{
                shrink: true,
            }}
        />

    </Grid>

    <Grid size={{ xs: 4 }}>

        <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
                height: 56,
            }}
        >
            Attach Report
            <input
                hidden
                type="file"
                onChange={(e) => {

                    if (e.target.files.length > 0) {

                        setReportFile(e.target.files[0]);

                    }

                }}
            />

        </Button>

    </Grid>

    <Grid
        size={{ xs: 12 }}
        sx={{
            display: "flex",
            gap: 2,
            mt: 2,
        }}
    >

        <Button
            variant="contained"
            color="success"
            onClick={handleCAPASubmit}
        >
            Submit CAPA for Approval
        </Button>

        <Button
            variant="outlined"
            color="inherit"
            size="large"
            onClick={() => setSelectedCAPA(null)}
        >
            Cancel
        </Button>

    </Grid>

</Grid>   

        )}


    


  <Paper
    elevation={1}
    sx={{
        mt: 4,
        p: 3,
        borderRadius: 3,
        border: "1px solid #dfe7ef",
    }}
>
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
        }}
    >
        <Typography
            sx={{
                fontSize: 24,
                fontWeight: 700,
            }}
        >
            SUBMITTED — AWAITING MANAGER APPROVAL
        </Typography>

        <Box
            sx={{
                width: 34,
                height: 34,
                bgcolor: "#fff3e0",
                color: "#ef6c00",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
            }}
        >
            {submittedCapas.length}
        </Box>
    </Box>

    {submittedCapas.map((capa) => (

        <Paper
            key={capa.id}
            variant="outlined"
            sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >

                <Typography fontWeight={700}>
                    {capa.part_number}
                </Typography>

                <Typography color="text.secondary">
                    {capa.department}
                </Typography>

                <Typography color="text.secondary">
                    •
                </Typography>

                <Typography color="text.secondary">
                    {capa.defect_type}
                </Typography>

                <Box
                    sx={{
                        bgcolor: "#eaf4ff",
                        px: 2,
                        py: .5,
                        borderRadius: 1,
                    }}
                >
                    Due {capa.target_date}
                </Box>

                {capa.report && (
                    <Button
                        size="small"
                        variant="outlined"
                    >
                        📎 Report
                    </Button>
                )

                }

            </Box>

            <Typography mt={2}>
                <b>Root Cause:</b> {capa.root_cause}
            </Typography>

            <Typography>
                <b>Corrective Action:</b> {capa.corrective_action}
            </Typography>

            <Typography>
                <b>Preventive Action:</b> {capa.preventive_action}
            </Typography>

            <Typography mt={1}>
                <b>Responsible:</b> {capa.assigned_to_name}
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                }}
            >

                {isSupervisor ? (

    <>
        {capa.approval_status === "PENDING" && (

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                }}
            >
                <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                        handleApproval(capa.id, "APPROVE")
                    }
                >
                    Approve
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                        handleApproval(capa.id, "REJECT")
                    }
                >
                    Reject
                </Button>
            </Box>

        )}

        {capa.approval_status === "APPROVED" && (

            <Button
                variant="contained"
                color="success"
                disableRipple
                sx={{
                    pointerEvents: "none",
                }}
            >
                Approved
            </Button>

        )}

        {capa.approval_status === "REJECTED" && (

            <Button
                variant="contained"
                color="error"
                disableRipple
                sx={{
                    pointerEvents: "none",
                }}
            >
                Rejected
            </Button>

        )}
    </>

) : (

    <>
        {capa.approval_status === "PENDING" && (
            <Button
                variant="contained"
                color="warning"
                disableRipple
                sx={{ pointerEvents: "none" }}
            >
                Awaiting Manager Approval
            </Button>
        )}

        {capa.approval_status === "APPROVED" && (
            <Button
                variant="contained"
                color="success"
                disableRipple
                sx={{ pointerEvents: "none" }}
            >
                Approved by Supervisor
            </Button>
        )}

        {capa.approval_status === "REJECTED" && (
            <Button
                variant="contained"
                color="error"
                disableRipple
                sx={{ pointerEvents: "none" }}
            >
                Rejected by Supervisor
            </Button>
        )}
    </>

)}

            </Box>

        </Paper>

    ))}

</Paper>

    </Box>
);
};

export default CAPA;