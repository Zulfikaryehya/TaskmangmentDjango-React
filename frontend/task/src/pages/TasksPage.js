import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Assignment as TaskIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const[error, setError] = useState("");
    const[statusFilter, setStatusFilter] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const navigate = useNavigate();
    
    const loadTasks = async (status='') => {
    try {
      const token = localStorage.getItem("access_token");

      const url= status ? `tasks/?status=${status}` : "tasks/";

      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data);
    } catch (error) {
        setError("Failed to load tasks. Please try again.");
        console.log(error);
    }
  };

  useEffect(() => {
    loadTasks(statusFilter);
  }, [statusFilter]);

  useEffect(() => {
   const token = localStorage.getItem("access_token");
   if (!token) {
       navigate("/login");
   }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  }

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      const token = localStorage.getItem("access_token");
      await api.delete(`tasks/${taskToDelete.id}/`, {
        headers: {  
          Authorization: `Bearer ${token}`,
        },
      });
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
      loadTasks(statusFilter); // Refresh the task list with current filter
    } catch (error) {
      setError("Failed to delete task. Please try again.");
      console.log(error);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  // Function to get status chip color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case 'completed':
      case 'done':
        return 'success';
      case 'in progress':
      case 'in_progress':
      case 'inprogress':
        return 'info';
      case 'pending':
      case 'todo':
        return 'warning';
      case 'cancelled':
      case 'canceled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Function to get priority chip color
  const getPriorityColor = (priority) => {
    const priorityLower = priority?.toLowerCase();
    switch(priorityLower) {
      case 'high':
      case 'urgent':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };



  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Header handleLogout={handleLogout} />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Header with Filter */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Tasks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Showing <strong>{tasks.length}</strong>{" "}
                {statusFilter
                  ? `${statusFilter.replace("_", " ")} `
                  : ""}
                task{tasks.length !== 1 ? "s" : ""}
              </Typography>
            </Box>

            {/* Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Tasks</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <Paper
            elevation={1}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <TaskIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {statusFilter
                ? `No ${statusFilter.replace("_", " ")} tasks`
                : "No tasks yet"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {statusFilter
                ? `You don't have any ${statusFilter.replace("_", " ")} tasks.`
                : "Start by creating your first task!"}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid item xs={12} sm={6} lg={4} key={task.id}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Task Title */}
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {task.title}
                    </Typography>

                    {/* Task Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {task.description || "No description provided"}
                    </Typography>

                    {/* Status and Priority Chips */}
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label={task.status}
                        color={getStatusColor(task.status)}
                        size="small"
                      />
                      <Chip
                        label={task.priority || "Normal"}
                        color={getPriorityColor(task.priority)}
                        size="small"
                      />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* Due Date */}
                    {task.due_date && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <CalendarIcon
                          sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )}

                    {/* Assigned To */}
                    {task.assigned_to && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <PersonIcon
                          sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {task.assigned_to}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  {/* Action Buttons */}
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/tasks/${task.id}/edit`)}
                      fullWidth
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(task)}
                      fullWidth
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="error" sx={{ fontSize: 32 }} />
          <Typography variant="h6" component="span" fontWeight="bold">
            Delete Task
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this task?
          </DialogContentText>
          {taskToDelete && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {taskToDelete.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {taskToDelete.description || "No description"}
              </Typography>
            </Box>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone!
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            size="large"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            size="large"
            startIcon={<DeleteIcon />}
            sx={{ minWidth: 100 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}