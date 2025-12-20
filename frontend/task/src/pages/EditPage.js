import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    MenuItem,
    Select,
    FormControl,
    Alert,
    Grid,
    Paper,
    Chip,
    Divider,
    Stack,
    CircularProgress,
} from "@mui/material";
import {
    Edit as EditIcon,
    Title as TitleIcon,
    Description,
    CalendarMonth,
    Flag,
    CheckCircle,
    ArrowBack,
} from "@mui/icons-material";

export default function EditTaskPage() {
    const { id } = useParams(); // Get task ID from URL
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [notAuthorized, setNotAuthorized] = useState(false);
    const navigate = useNavigate();

    // Load existing task data
        useEffect(() => {
        const loadTask = async () => {
            try {
                const token = localStorage.getItem("access_token");
                
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await api.get(`tasks/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const task = response.data;
                setTitle(task.title);
                setDescription(task.description);
                setStatus(task.status);
                setDueDate(task.due_date);
                setPriority(task.priority);
                setLoading(false);
            } catch (err) {
                setLoading(true);
                
                // Check if it's a 403 (Forbidden) or 404 (Not Found) error
                if (err.response?.status === 403 || err.response?.status === 404) {
                    setNotAuthorized(true);
                    setTimeout(() => {
                        navigate("/home");
                    }, 2000); // Redirect after 2 seconds
                } else {
                    setError("Failed to load task. Please try again.");
                }
                console.log(err);
            }
        };
        loadTask();
    }, [id, navigate]);

    const handleUpdateTask = async (e) => {
        e.preventDefault();

        //validation for due date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(dueDate);
        if (selectedDate < today) {
            setError("Due date cannot be in the past.");
            return;
        }
        try {
        const token = localStorage.getItem("access_token");
        const response = await api.patch(
            `tasks/${id}/`,
            {
                title,
                description,
                status,
                due_date: dueDate,
                priority,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        navigate("/home");
        console.log("Task updated successfully:", response.data);
    }catch (err) {
        setError("Failed to update task. Please try again.");
        console.log(err);
    }}

    const getPriorityColor = () => {
        switch (priority) {
            case "high":
                return "error";
            case "medium":
                return "warning";
            case "low":
                return "success";
            default:
                return "default";
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">
                        Loading task...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
                py: 4,
                px: 2,
            }}
        >
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box sx={{ mb: 3 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/home")}
                        sx={{
                            mb: 2,
                        }}
                    >
                        Back to Tasks
                    </Button>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <EditIcon sx={{ fontSize: 40, color: "primary.main" }} />
                        <Box>
                            <Typography
                                variant="h4"
                                component="h1"
                                fontWeight="bold"
                            >
                                Edit Task
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Update the task details below
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    {/* Main Form */}
                    <Grid item xs={12} md={8}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 4,
                                borderRadius: 2,
                                backgroundColor: "white",
                            }}
                        >
                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{ mb: 3 }}
                                    onClose={() => setError("")}
                                >
                                    {error}
                                </Alert>
                            )}

                            {notAuthorized && (
                                <Alert severity="warning" sx={{ mb: 3 }}>
                                    You are not authorized to edit this task. Redirecting...
                                </Alert>
                            )}

                            <Box component="form" onSubmit={handleUpdateTask}>
                                <Stack spacing={3}>
                                    {/* Title Field */}
                                    <Box>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                            <TitleIcon sx={{ mr: 1, color: "primary.main" }} />
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                Task Title
                                            </Typography>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            placeholder="Enter a descriptive task title"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "&:hover fieldset": {
                                                        borderColor: "primary.main",
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Description Field */}
                                    <Box>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                            <Description sx={{ mr: 1, color: "primary.main" }} />
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                Description
                                            </Typography>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            multiline
                                            rows={5}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            placeholder="Provide detailed information about the task..."
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "&:hover fieldset": {
                                                        borderColor: "primary.main",
                                                    },
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Divider />

                                    {/* Date, Priority, Status Row */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={4}>
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                <CalendarMonth sx={{ mr: 1, color: "primary.main", fontSize: 20 }} />
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    Due Date
                                                </Typography>
                                            </Box>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                variant="outlined"
                                                value={dueDate}
                                                onChange={(e) => setDueDate(e.target.value)}
                                                required
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                <Flag sx={{ mr: 1, color: "primary.main", fontSize: 20 }} />
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    Priority
                                                </Typography>
                                            </Box>
                                            <FormControl fullWidth required>
                                                <Select
                                                    value={priority}
                                                    onChange={(e) => setPriority(e.target.value)}
                                                    sx={{
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: `${getPriorityColor()}.main`,
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value="low">
                                                        <Chip label="Low" size="small" color="success" />
                                                    </MenuItem>
                                                    <MenuItem value="medium">
                                                        <Chip label="Medium" size="small" color="warning" />
                                                    </MenuItem>
                                                    <MenuItem value="high">
                                                        <Chip label="High" size="small" color="error" />
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                <CheckCircle sx={{ mr: 1, color: "primary.main", fontSize: 20 }} />
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    Status
                                                </Typography>
                                            </Box>
                                            <FormControl fullWidth required>
                                                <Select
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                >
                                                    <MenuItem value="pending">Pending</MenuItem>
                                                    <MenuItem value="completed">Completed</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 2 }} />

                                    {/* Action Buttons */}
                                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", pt: 2 }}>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={() => navigate("/home")}
                                            sx={{
                                                minWidth: 120,
                                                borderWidth: 2,
                                                "&:hover": {
                                                    borderWidth: 2,
                                                },
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            startIcon={<EditIcon />}
                                            sx={{
                                                minWidth: 180,
                                            }}
                                        >
                                            Update Task
                                        </Button>
                                    </Box>
                                </Stack>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Info Sidebar */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                backgroundColor: "white",
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Edit Tips
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                        ✏️ Update Carefully
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Review all changes before saving to ensure accuracy.
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                        🔄 Status Changes
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Update the status to reflect current progress on the task.
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                        ⚡ Priority Adjustment
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Change priority as circumstances evolve and urgency shifts.
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                        📅 Deadline Extension
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Adjust due dates if needed, but communicate changes to your team.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Current Task Info */}
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                mt: 3,
                                backgroundColor: "primary.main",
                                color: "white",
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Current Task
                            </Typography>
                            <Divider sx={{ mb: 2, backgroundColor: "rgba(255,255,255,0.3)" }} />
                            <Stack spacing={1.5}>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        Title
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {title || "No title"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        Priority
                                    </Typography>
                                    <Box>
                                        <Chip
                                            label={priority.toUpperCase()}
                                            size="small"
                                            color={getPriorityColor()}
                                            sx={{ mt: 0.5 }}
                                        />
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                        Status
                                    </Typography>
                                    <Typography variant="body2">
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Typography>
                                </Box>
                                {dueDate && (
                                    <Box>
                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                            Due Date
                                        </Typography>
                                        <Typography variant="body2">
                                            {new Date(dueDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );


}