import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import {
  getSystemSettings,
  updateSystemSettings,
} from "../../services/authService";

import useAuthStore from "../../store/authStore";

const Settings = () => {
  const [escalationLimit, setEscalationLimit] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const user = useAuthStore((state) => state.user);

  const isSupervisor = user?.role === "SUPERVISOR";

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSystemSettings();

        setEscalationLimit(data.escalation_limit);
      } catch (error) {
        setMessage(error.message);
        setMessageType("error");
      }
    };

    if (isSupervisor) {
      loadSettings();
    }
  }, [isSupervisor]);

  /*
    Frontend guard:
    non-Supervisors who type /settings manually return to Entry.
    The backend permission remains the real security protection.
  */
  if (!isSupervisor) {
    return <Navigate to="/entry" replace />;
  }

  const handleSave = async () => {
    const numericLimit = Number(escalationLimit);

    if (
      !escalationLimit ||
      Number.isNaN(numericLimit) ||
      numericLimit <= 0 ||
      numericLimit > 100
    ) {
      setMessage(
        "Escalation limit must be a number greater than 0 and at most 100."
      );
      setMessageType("error");
      return;
    }

    try {
      const data = await updateSystemSettings(numericLimit);

      setEscalationLimit(data.escalation_limit);

      setMessage(
        "Escalation limit updated successfully. New rejection entries will now use this value."
      );
      setMessageType("success");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
        maxWidth: 600,
      }}
    >
      {message && (
        <Alert
          severity={messageType}
          sx={{
            mb: 3,
          }}
        >
          {message}
        </Alert>
      )}

      <Typography
        variant="h5"
        fontWeight={700}
        mb={1}
      >
        System Settings
      </Typography>

      <Typography
        color="text.secondary"
        mb={3}
      >
        Set the global rejection percentage that automatically opens a CAPA.
        This value applies to all new rejection entries.
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
          sx={{mt: 3}}
          value={escalationLimit}
          inputProps={{
            min: 0.01,
            max: 100,
            step: 0.01,
          }}
          onChange={(event) => {
            setEscalationLimit(event.target.value);
            setMessage("");
          }}
          helperText="Example: 3 means a CAPA opens above 3% rejection."
        />

        <Button
          variant="contained"
          onClick={handleSave}
        >
          Save Escalation Limit
        </Button>
      </Box>
    </Paper>
  );
};

export default Settings;