import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import {
    AddTask,
    Title as TitleIcon,
    Description,
    CalendarMonth,
    Flag,
    CheckCircle,
    ArrowBack,
} from "@mui/icons-material";
import Header from "../component/Header";

export default function CreateTasksPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    const handleCreateTask = async (e) => {
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
            const response = await api.post(
                "tasks/",
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
            );
            navigate("/home");
            console.log("Task created successfully:", response.data);
        } catch (err) {
            setError("Failed to create task. Please try again.");
            console.log(err);
        }
    };

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

    return (
        <>
            <Header handleLogout={handleLogout} />
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
                 
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <AddTask sx={{ fontSize: 40, color: "primary.main" }} />
                        <Box>
                            <Typography
                                variant="h4"
                                component="h1"
                                fontWeight="bold"
                            >
                                Create New Task
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Fill in the details below to create a new task
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

                            <Box component="form" onSubmit={handleCreateTask}>
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
                                            onClick={() => navigate("/Home")}
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
                                            startIcon={<AddTask />}
                                            sx={{
                                                minWidth: 180,
                                            }}
                                        >
                                            Create Task
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
                                Quick Tips
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                        📝 Title
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Use clear, action-oriented language that describes what needs to be done.
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                        📋 Description
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Include all relevant details, requirements, and context for the task.
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                        🎯 Priority
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        High for urgent tasks, Medium for normal work, Low for nice-to-haves.
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                                        📅 Due Date
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Set realistic deadlines to keep projects on track.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>

                       
                    </Grid>
                </Grid>
            </Container>
            </Box>
        </>
    );
}