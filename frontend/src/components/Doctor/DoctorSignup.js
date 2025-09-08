import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Paper,
  Avatar,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const genders = ["Male", "Female", "Other"];

export default function DoctorSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    dateOfBirth: "",
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
  };

  const handleDateChange = (newValue) => {
    setFormData({ ...formData, dateOfBirth: parseDate(newValue) });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      // Replace this with your actual upload endpoint
      const res = await fetch("http://localhost:8000/api/upload/image", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.imageUrl) {
        setFormData({ ...formData, profilePictureUrl: data.imageUrl });
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Doctor Signup Data:", formData);

    fetch("http://localhost:8000/api/auth/doctor/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Signup successful!");
          navigate("/doctor/login");
        } else alert("Signup failed: " + data.error);
        console.log(data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={6} sx={{ p: 4, mt: 6, borderRadius: 3 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Doctor Profile Signup
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" mb={3}>
          Fill in your details to create your professional doctor profile
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Image Upload */}
            <Grid item xs={12} textAlign="center">
              <Avatar
                src={formData.profilePictureUrl}
                alt="Profile"
                sx={{ width: 100, height: 100, margin: "auto", mb: 2 }}
              />
              <Button
                variant="contained"
                component="label"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Picture"}
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageUpload}
                />
              </Button>
            </Grid>

            {/* Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Username */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                fullWidth
                required
              >
                {genders.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth || null}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth required />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            {/* Degree */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Specialization */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Hospital */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hospital"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Medical College */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Medical College"
                name="medicalCollege"
                value={formData.medicalCollege}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* Experience */}
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Experience (years)"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* BMDC Registration Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="BMDC Registration Number"
                name="BMDCNumber"
                value={formData.BMDCNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* About */}
            <Grid item xs={12}>
              <TextField
                label="About"
                name="about"
                value={formData.about}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          {/* Submit */}
          <Box textAlign="center" mt={4}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: "8px",
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                fontWeight: "bold",
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
