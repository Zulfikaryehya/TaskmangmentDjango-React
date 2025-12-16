import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  Box,
  Container,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  Stack,
  Chip,
  InputLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Assignment as LogsIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as ProfileIcon,
  Task as TaskIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import api from "../api/axios";

export default function Header({
  statusFilter,
  setStatusFilter,
  handleLogout,
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [loading, setLoading] = useState(true);

  // Memoized function to check superuser status
  const checkSuperuser = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsSuperuser(false);
        return;
      }

      const response = await api.get("check-superuser/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsSuperuser(response.data.is_superuser);
    } catch (error) {
      console.error("Error checking superuser status:", error);
      setIsSuperuser(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSuperuser();
  }, [checkSuperuser]);

  // Memoized logout handler
  const handleLogoutClick = useCallback(() => {
    if (handleLogout) {
      handleLogout();
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    }
  }, [handleLogout, navigate]);

  // Navigation handlers
  const handleCreateTask = useCallback(
    () => navigate("/create-task"),
    [navigate]
  );
  const handleViewLogs = useCallback(() => navigate("/logs"), [navigate]);
  const handleViewProfile = useCallback(
    () => navigate("/user-profile"),
    [navigate]
  );
  const handleViewTeams = useCallback(() => navigate("/teams"), [navigate]);

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        background: "linear-gradient(90deg, #1976d2 0%, #5e35b1 100%)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1, gap: 2 }}>
          {/* Logo/Brand Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                p: 1,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <TaskIcon sx={{ fontSize: 28, color: "white" }} />
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "-0.5px",
                }}
              >
                Task Manager
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.7rem",
                }}
              >
                Stay organized, stay productive
              </Typography>
            </Box>
          </Box>

          {/* Actions Section */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Filter Dropdown */}
            <FormControl
              size="small"
              sx={{
                minWidth: isMobile ? 100 : 130,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 1,
                backdropFilter: "blur(10px)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
              }}
            >
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                startAdornment={
                  <FilterIcon sx={{ mr: 0.5, fontSize: 18, color: "white" }} />
                }
                sx={{
                  color: "white",
                  "& .MuiSelect-icon": { color: "white" },
                  fontSize: "0.875rem",
                }}
              >
                <MenuItem value="">All Tasks</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>

            {/* New Task Button */}
            <Tooltip title="Create new task" arrow>
              <Button
                variant="contained"
                color="success"
                startIcon={!isMobile && <AddIcon />}
                onClick={handleCreateTask}
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: 2,
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 4,
                  },
                  transition: "all 0.2s",
                  minWidth: isMobile ? 40 : "auto",
                  px: isMobile ? 1 : 2,
                }}
              >
                {isMobile ? <AddIcon /> : "New Task"}
              </Button>
            </Tooltip>

            {/* View Logs Button - Only for superusers */}
            {!loading && isSuperuser && (
              <Tooltip title="View logs" arrow>
                {isTablet ? (
                  <IconButton
                    onClick={handleViewLogs}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    <LogsIcon />
                  </IconButton>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<LogsIcon />}
                    onClick={handleViewLogs}
                    sx={{
                      color: "white",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(10px)",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    Logs
                  </Button>
                )}
              </Tooltip>
            )}

            {/* Teams Button */}
            <Tooltip title="View teams" arrow>
              {isTablet ? (
                <IconButton
                  onClick={handleViewTeams}
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.25)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <GroupIcon />
                </IconButton>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<GroupIcon />}
                  onClick={handleViewTeams}
                  sx={{
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      backgroundColor: "rgba(255, 255, 255, 0.25)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  Teams
                </Button>
              )}
            </Tooltip>

            {/* User Profile Button */}
            <Tooltip title="View profile" arrow>
              <IconButton
                onClick={handleViewProfile}
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s",
                }}
              >
                <ProfileIcon />
              </IconButton>
            </Tooltip>

            {/* Logout Button */}
            <Tooltip title="Logout" arrow>
              {isMobile ? (
                <IconButton
                  onClick={handleLogoutClick}
                  sx={{
                    color: "white",
                    backgroundColor: "error.main",
                    "&:hover": {
                      backgroundColor: "error.dark",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogoutClick}
                  sx={{
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: 2,
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 4,
                    },
                    transition: "all 0.2s",
                  }}
                >
                  Logout
                </Button>
              )}
            </Tooltip>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
