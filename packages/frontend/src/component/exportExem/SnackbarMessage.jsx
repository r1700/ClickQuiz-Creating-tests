import React from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarMessage = ({ open, message, onClose }) => (
  <Snackbar open={open} autoHideDuration={2000} onClose={onClose} anchorOrigin={{ vertical:"bottom", horizontal:"center" }}>
    <Alert severity="success" sx={{ width:'100%' }}>{message}</Alert>
  </Snackbar>
);

export default SnackbarMessage;
