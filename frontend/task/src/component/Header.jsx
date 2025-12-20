import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Assignment as LogsIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as ProfileIcon,
  Home as HomeIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import api from "../api/axios";

export default function Header({ handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  // Determine current tab based on location
  useEffect(() => {
    const path = location.pathname;
    if (path === "/tasks" || path === "/") {
      setCurrentTab(0);
    } else if (path === "/teams") {
      setCurrentTab(1);
    } else if (path === "/create-task") {
      setCurrentTab(2);
    } else if (path === "/user-profile") {
      setCurrentTab(3);
    } else if (path === "/logs") {
      setCurrentTab(4);
    }
  }, [location]);

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
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    switch (newValue) {
      case 0:
        navigate("/home");
        break;
      case 1:
        navigate("/teams");
        break;
      case 2:
        navigate("/create-task");
        break;
      case 3:
        navigate("/user-profile");
        break;
      case 4:
        navigate("/logs");
        break;
      default:
        break;
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: "white",
        color: "text.primary",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Logo/Brand Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate("/tasks")}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 1,
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              }}
            >
              <HomeIcon sx={{ fontSize: 24, color: "white" }} />
            </Box>
            {!isMobile && (
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  letterSpacing: "-0.5px",
                }}
              >
                Task Manager
              </Typography>
            )}
          </Box>

          {/* Navigation Tabs */}
          {!isMobile ? (
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "1rem",
                    minWidth: 100,
                  },
                }}
              >
                <Tab icon={<HomeIcon />} iconPosition="start" label="Home" />
                <Tab icon={<GroupIcon />} iconPosition="start" label="Teams" />
                <Tab icon={<AddIcon />} iconPosition="start" label="New Task" />
                <Tab icon={<ProfileIcon />} iconPosition="start" label="Profile" />
                {!loading && isSuperuser && (
                  <Tab icon={<LogsIcon />} iconPosition="start" label="Logs" />
                )}
              </Tabs>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1 }} />
          )}

          {/* Logout Button */}
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogoutClick}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            {!isMobile && "Logout"}
            {isMobile && <LogoutIcon />}
          </Button>
        </Toolbar>

        {/* Mobile Navigation */}
        {isMobile && (
          <Box sx={{ borderTop: 1, borderColor: "divider" }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  minWidth: 80,
                },
              }}
            >
              <Tab icon={<HomeIcon />} label="Home" />
              <Tab icon={<GroupIcon />} label="Teams" />
              <Tab icon={<AddIcon />} label="New Task" />
              <Tab icon={<ProfileIcon />} label="Profile" />
              {!loading && isSuperuser && (
                <Tab icon={<LogsIcon />} label="Logs" />
              )}
            </Tabs>
          </Box>
        )}
      </Container>
    </AppBar>
  );
}
