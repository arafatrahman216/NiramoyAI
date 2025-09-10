import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Avatar,
  Grid,
  MenuItem,
  CircularProgress,
  Link,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalHospital, HealthAndSafety } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const genders = ["Male", "Female", "Other"];

const DoctorSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    dateOfBirth: null,
    degree: "",
    about: "",
    hospital: "",
    profilePictureUrl: "",
    BMDCNumber: "",
    role: "DOCTOR",
    specialization: "",
    medicalCollege: "",
    experience: "",
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dark theme styles for form inputs
  const darkTextFieldStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#27272a',
      color: '#ffffff',
      borderRadius: '8px',
      transition: 'all 0.2s ease-in-out',
      '& fieldset': { 
        borderColor: '#3f3f46',
        borderWidth: '1.5px'
      },
      '&:hover fieldset': { 
        borderColor: '#10b981',
        borderWidth: '1.5px'
      },
      '&.Mui-focused fieldset': { 
        borderColor: '#10b981',
        borderWidth: '2px',
        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)'
      },
    },
    '& .MuiInputLabel-root': { 
      color: '#a1a1aa',
      fontWeight: 500
    },
    '& .MuiInputLabel-root.Mui-focused': { 
      color: '#10b981',
      fontWeight: 600
    },
    '& .MuiSelect-icon': { 
      color: '#a1a1aa' 
    },
    '& .MuiInputBase-input': {
      padding: '14px 16px'
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleDateChange = (newValue) => {
    setFormData({ ...formData, dateOfBirth: newValue });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const res = await fetch("http://localhost:8000/api/upload/image", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.imageUrl) {
        setFormData({ ...formData, profilePictureUrl: data.imageUrl });
      } else {
        setError("Image upload failed");
      }
    } catch (err) {
      console.error(err);
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth
          ? formData.dateOfBirth.toISOString().split("T")[0]
          : "2000-12-12",
      };

      const res = await fetch("http://localhost:8000/api/auth/doctor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("Signup successful!");
        navigate("/doctor/login");
      } else {
        setError(data.error || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
        <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a", // Dark background like SearchInput
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="md">
                <Card
          sx={{
            borderRadius: 3,
            backgroundColor: "#171717", // Dark card background
            border: "1px solid #404040", // Gray border
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
                    {/* Header */}
          <Box
            sx={{
              background: "#27272a",
              p: 4,
              textAlign: "center",
            }}
          >
            <LocalHospital sx={{ fontSize: 48, color: "#10b981", mb: 2 }} />
            <Typography variant="h4" sx={{ color: "#ffffff", fontWeight: 600 }}>
              NiramoyAI
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "#e5e5e5", mt: 1 }}
            >
              Create your professional doctor profile
            </Typography>
          </Box>

          {/* Form */}
          <CardContent sx={{ p: 4, backgroundColor: "#18181b" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <HealthAndSafety sx={{ mr: 2, color: "#10b981" }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#10b981" }}>
                Doctor
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {/* Avatar Upload */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Avatar
                  src={formData.profilePictureUrl}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    margin: "auto", 
                    mb: 3,
                    border: "3px solid #10b981",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                  }}
                />
                <Button
                  variant="contained"
                  component="label"
                  disabled={uploading}
                  sx={{ 
                    px: 4,
                    py: 1.2,
                    backgroundColor: "#10b981",
                    color: "#ffffff",
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#059669",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)"
                    },
                    "&:disabled": {
                      backgroundColor: "#3f3f46",
                      color: "#71717a",
                    },
                    transition: "all 0.2s ease-in-out"
                  }}
                >
                  {uploading ? "Uploading..." : "Upload Picture"}
                  <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                </Button>
              </Box>

              {/* Personal Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: "#e5e5e5", mb: 3, fontWeight: 600, borderBottom: "1px solid #3f3f46", pb: 1 }}>
                  Personal Information
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Row 1: Full Name and Username */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={darkTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={darkTextFieldStyle}
                    />
                  </Grid>

                  {/* Row 2: Email and Password */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="email"
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={darkTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="password"
                      label="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={darkTextFieldStyle}
                    />
                  </Grid>

                  {/* Row 3: Gender and Date of Birth */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={{
                        ...darkTextFieldStyle,
                        '& .MuiSelect-select': {
                          minWidth: '120px',
                          textAlign: 'left'
                        }
                      }}
                    >
                      {genders.map((g) => (
                        <MenuItem key={g} value={g} sx={{ 
                          color: '#ffffff', 
                          backgroundColor: '#27272a',
                          '&:hover': { backgroundColor: '#3f3f46' }
                        }}>
                          {g}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date of Birth"
                        value={formData.dateOfBirth || null}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth required sx={darkTextFieldStyle} />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Box>

              {/* Professional Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: "#e5e5e5", mb: 3, fontWeight: 600, borderBottom: "1px solid #3f3f46", pb: 1 }}>
                  Professional Information
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Row 1: Degree and Specialization */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Degree (e.g., MBBS, MD)"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={darkTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={darkTextFieldStyle}
                    />
                  </Grid>

                  {/* Row 2: Hospital and Medical College */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Current Hospital/Clinic"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={darkTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Medical College"
                      name="medicalCollege"
                      value={formData.medicalCollege}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={darkTextFieldStyle}
                    />
                  </Grid>

                  {/* Row 3: Experience and BMDC Number */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="number"
                      label="Experience (years)"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 0, max: 50 }}
                      sx={darkTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="BMDC Registration Number"
                      name="BMDCNumber"
                      value={formData.BMDCNumber}
                      onChange={handleChange}
                      fullWidth
                      required
                      sx={darkTextFieldStyle}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* About Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: "#e5e5e5", mb: 3, fontWeight: 600, borderBottom: "1px solid #3f3f46", pb: 1 }}>
                  About Yourself
                </Typography>
                <TextField
                  label="Professional Summary"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  sx={darkTextFieldStyle}
                  placeholder="Tell us about your medical background, expertise, achievements, and what makes you passionate about healthcare. This will help patients understand your qualifications and approach to medicine."
                />
              </Box>

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  backgroundColor: "#10b981",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  "&:hover": {
                    backgroundColor: "#059669",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(16, 185, 129, 0.4)",
                  },
                  "&:disabled": {
                    backgroundColor: "#3f3f46",
                    color: "#71717a",
                    transform: "none",
                    boxShadow: "none",
                  },
                  transition: "all 0.2s ease-in-out"
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={20} color="inherit" />
                    Creating Account...
                  </Box>
                ) : (
                  "Create Doctor Account"
                )}
              </Button>
            </form>

            {/* Links */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" sx={{ color: "#e5e5e5" }}>
                Already have an account?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/doctor/login")}
                  sx={{ textDecoration: "none", color: "#10b981", "&:hover": { color: "#059669" } }}
                >
                  Doctor Login
                </Link>
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant="body2" sx={{ color: "#e5e5e5" }}>
                Patient?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/login")}
                  sx={{ textDecoration: "none", color: "#10b981", "&:hover": { color: "#059669" } }}
                >
                  Patient Login
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DoctorSignup;
