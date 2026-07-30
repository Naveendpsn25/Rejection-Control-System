import {Box,Paper,Typography,Grid,TextField,MenuItem,Button,Alert} from "@mui/material";
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Chip} from "@mui/material";

// import {getDepartments,getDefectTypes} from "../../services/authService";

import { useState,useEffect } from "react";

// import { createRejection } from "../../services/authService";

import { getSystemSettings } from "../../services/authService";

import {createRejection,getDepartments,getDefectTypes,getRejections,} from "../../services/authService";
const Entry = () => {

    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
    date: today,
    department: "",
    partNumber: "",
    operation: "",
    producedQty: "",
    rejectedQty: "",
    defectType: "",
    remarks: "",
});
    
    const rejection =
        formData.producedQty && formData.rejectedQty
            ? (
                (Number(formData.rejectedQty) /
                    Number(formData.producedQty)) *
                100
            ).toFixed(2)
            : null;

    const rejectionText = rejection ? `${rejection}%` : "—";


    const [error, setError] = useState("");


    const handleSubmit = async () => {

    // Frontend validation
    if (
        !formData.partNumber ||
        !formData.operation ||
        !formData.producedQty ||
        !formData.rejectedQty
    ) {
        setError("Check part number and quantities before saving.");
        return;
    }

    setError("");

    try {
        const result = await createRejection(formData);
        // console.log(result);
        await loadRecentEntries();

        window.dispatchEvent(
            new Event("capaUpdated")
        );

        setAlert({
            severity: result.severity,
            message: result.message,
        });

        console.log(result);

    } catch (error) {

        setAlert({
            severity: "error",
            message: error.message,
        });

        console.error(error);

    }
};

    const [escalationLimit, setEscalationLimit] = useState(3);
    // const ESCALATION_LIMIT = 3;

    const isEscalated = rejection && Number(rejection) > escalationLimit;

    const [alert, setAlert] = useState(null);


    const [departments, setDepartments] = useState([]);
    // const [shifts, setShifts] = useState([]);
    // const [parts, setParts] = useState([]);
    // const [operations, setOperations] = useState([]);
    const [defectTypes, setDefectTypes] = useState([]);

   const [entries, setEntries] = useState([]);

    const loadRecentEntries = async () => {

        const data = await getRejections();

        setEntries(data);

    };

    useEffect(() => {

    const loadMasters = async () => {
    const departmentsData = await getDepartments();
    const defectTypesData = await getDefectTypes();
    // const rejectionsData = await getRejections();
    const settingsData = await getSystemSettings();

    console.log(settingsData);

     setEscalationLimit(
        Number(settingsData.escalation_limit)
    );

    setDepartments(departmentsData);
    setDefectTypes(defectTypesData);
    // setEntries(rejectionsData);
    await loadRecentEntries();

    setFormData((prev) => ({
        ...prev,
        department:
            departmentsData.length > 0 ? departmentsData[0].id : "",
        defectType:
            defectTypesData.length > 0 ? defectTypesData[0].id : "",
    }));
    console.log("Departments:", departmentsData);
    console.log("Defects:", defectTypesData);
};

    loadMasters();

}, []);

  return (
    <Box
      sx={{
        background: "#eef2f6",
        minHeight: "100vh",
        p: 1,
      }}
    >


        {error && (
    <Alert
        severity="error"
        sx={{
            maxWidth: 1250,
            mx: "auto",
            mb: 2,
        }}
    >
        {error}
    </Alert>
)}

       {alert && (
    <Alert
        severity={alert.severity}
        sx={{
            maxWidth: 1250,
            mx: "auto",
            mb: 2,
        }}
    >
        {alert.message}
    </Alert>
)}
      {/* Rejection Slip Card */}
      <Paper
        elevation={1}
        sx={{
          maxWidth: 1250,
          mx: "auto",
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* Heading */}
        <Typography
          sx={{
            fontWeight: 700,
            letterSpacing: 1,
            mb: 4,
          }}
        >
          REJECTION SLIP ENTRY
        </Typography>

        <Grid container spacing={2}>
          {/* Date */}
          <Grid size={{ xs: 12, md: 2 }}>
           <input
    type="text"
    placeholder="DD-MM-YYYY"
    value={formData.date}
    onChange={(e) =>
        setFormData({
            ...formData,
            date: e.target.value,
        })
    }
    style={{
        width: "100%",
        height: "56px",
        padding: "0 14px",
        fontSize: "16px",
        border: "1px solid #c4c4c4",
        borderRadius: "4px",
        outline: "none",
        boxSizing: "border-box",
    }}
/>
          </Grid>

          {/* Department */}
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
                label="Department"
                select
                fullWidth
                value={formData.department}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        department: e.target.value,
                    })
                }
            >
                 {departments.map((dept) => (
                    <MenuItem
                        key={dept.id}
                        value={dept.id}
                    >
                        {dept.department_name}
                    </MenuItem>
                ))}
            </TextField>
          </Grid>

          {/* Part Number */}
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
                label="Part Number"
                placeholder="e.g. SPIDER-03"
                fullWidth
                value={formData.partNumber}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        partNumber: e.target.value,
                    })
                }
            />
          </Grid>

          {/* Operation */}
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
                label="Operation"
                placeholder="e.g. Cold Forging OP20"
                fullWidth
                value={formData.operation}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        operation: e.target.value,
                    })
                }
            />
          </Grid>

          {/* Produced Qty */}
          <TextField
            label="Produced Qty"
            type="number"
            value={formData.producedQty}
            onChange={(e) =>
                setFormData({
                    ...formData,
                    producedQty: e.target.value,
                })
            }
        />

          {/* Rejected Qty */}
          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
                label="Rejected Qty"
                type="number"
                fullWidth
                value={formData.rejectedQty}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        rejectedQty: e.target.value,
                    })
                }
            />
          </Grid>

          {/* Defect Type */}
          <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                    label="Defect Type"
                    select
                    fullWidth
                    value={formData.defectType}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            defectType: e.target.value,
                        })
                    }
                >
                    {defectTypes.map((defect) => (
                        <MenuItem
                            key={defect.id}
                            value={defect.id}
                        >
                            {defect.defect_name}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
          {/* Remarks */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Remarks"
              fullWidth
              value={formData.remarks}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  remarks: e.target.value,
                })
              } 
            />
          </Grid>
        </Grid>

        {/* Bottom */}
        <Box
    sx={{
        mt: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    }}
>
    <Typography
        sx={{
            fontSize: 28,
            fontWeight: 500,
        }}
    >
        Rejection:
        {" "}
        <span
            style={{
                color: isEscalated ? "#d32f2f" : "#00864b",
                fontWeight: 700,
            }}
        >
            {rejectionText}
        </span>

        <span
            style={{
                color: "#777",
                fontSize: 18,
            }}
        >
            {" "}
            (limit {escalationLimit}%)

                    {isEscalated && (
            <Box
                sx={{
                    display: "inline-block",
                    ml: 2,
                    px: 2,
                    py: 0.6,
                    borderRadius: 1,
                    bgcolor: "#fdecea",
                    color: "#d32f2f",
                    border: "1px solid #f5c2c7",
                    fontWeight: 600,
                    fontSize: 13,
                    textTransform: "uppercase",
                }}
            >
                WILL ESCALATE TO PLANT HEAD + CAPA OPENS
            </Box>
)}
        </span>
    </Typography>

    <Button
        variant="contained"
        color="error"
        sx={{
            width: 210,
            height: 48,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            fontSize: 16,
        }}
         onClick={handleSubmit}
    >
        Save rejection entry
    </Button>
</Box>
      </Paper>


      <Paper
            elevation={1}
            sx={{
                maxWidth: 1250,
                mx: "auto",
                mt: 3,
                p: 3,
                borderRadius: 3,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    mb: 2,
                }}
            >
                Recent Entries
            </Typography>

                <TableContainer>
                    <Table>

                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Dept</strong></TableCell>
                                <TableCell><strong>Part</strong></TableCell>
                                <TableCell><strong>Defect</strong></TableCell>
                                <TableCell align="right"><strong>Prod</strong></TableCell>
                                <TableCell align="right"><strong>Rej</strong></TableCell>
                                <TableCell align="right"><strong>%</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                        {entries.map((entry) => (
                            <TableRow key={entry.id}>

                                <TableCell>
                                    {entry.entry_date}
                                </TableCell>

                                <TableCell>
                                    {entry.department_name}
                                </TableCell>

                                <TableCell>
                                    {entry.part_number}
                                </TableCell>

                                <TableCell>
                                    {entry.defect_name}
                                </TableCell>

                                <TableCell align="right">
                                    {entry.produced_quantity}
                                </TableCell>

                                <TableCell align="right">
                                    {entry.rejected_quantity}
                                </TableCell>

                                <TableCell
                                    align="right"
                                    sx={{
                                        fontWeight: 700,
                                        color:
                                            Number(entry.rejection_percentage) > 3
                                                ? "#d32f2f"
                                                : "#2e7d32",
                                    }}
                                >
                                    {entry.rejection_percentage}%
                                </TableCell>

                                <TableCell>

                                {entry.status === "PENDING_SUPERVISOR" && (
                                    <Chip
                                        label="PENDING: Supervisor"
                                        color="warning"
                                    />
                                )}

                                {entry.status === "APPROVED" && (
                                    <Chip
                                        label="APPROVED BY SUPERVISOR"
                                        color="success"
                                    />
                                )}

                                {entry.status === "REJECTED" && (
                                    <Chip
                                        label="REJECTED BY SUPERVISOR"
                                        color="error"
                                    />
                                )}

                            </TableCell>
                               

                            </TableRow>
                        ))}
                    </TableBody>

                    </Table>
</TableContainer>

        </Paper>
    </Box>
  );
};

export default Entry;