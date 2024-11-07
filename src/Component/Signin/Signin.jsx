import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

// Styled components
const BackgroundWrapper = styled(Box)({
  position: "relative",
  height: "100vh",
  width: "100%",
  overflow: "hidden",
});

const BackgroundImage = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.jpg)`, // Replace with your image path
  backgroundSize: "cover",
  backgroundPosition: "center",
  //filter: "blur(2.5px)", // Blurs only the background image
  zIndex: 1,
});

const ContentContainer = styled(Box)({
  position: "relative",
  zIndex: 2,
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const CustomPaper = styled(Paper)({
  padding: "20px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "1000px",
  height: "auto",
  display: "flex",
  alignItems: "center",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  overflow: "hidden",
  backgroundColor: "#ffffff",
});

const LeftContainer = styled(Box)({
  flex: 1,
  padding: "20px",
});

const RightContainer = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "0px",
  height: "100%",
});

const CustomButton = styled(Button)({
  marginTop: "20px",
  borderRadius: "30px",
  width: "100%",
  padding: "10px 0",
  backgroundColor: "#f15a22",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#d14e1d",
  },
});

const StyledTextField = styled(TextField)({
  marginBottom: "20px",
  width: "100%",
  "& label.Mui-focused": {
    color: "#000000",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#000000",
    },
    "&:hover fieldset": {
      borderColor: "#000000",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#000000",
    },
  },
});

const Rectangle = styled(Box)({
  width: "80px",
  height: "8px",
  backgroundColor: "#f15a22",
  borderRadius: "5px",
  margin: "10px 0 20px 0",
});

function SignInPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setError("");
        // Store user data in localStorage for persistence
        localStorage.setItem("token", data.token); // Assuming token is returned
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user details

        onLogin(data);
        navigate("/", { replace: true });
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDownPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <BackgroundWrapper>
      <BackgroundImage />
      <ContentContainer>
        <CustomPaper elevation={3}>
          <LeftContainer>
            <img
              src={`${process.env.PUBLIC_URL}/images/logo.webp`}
              alt="Logo"
              style={{ width: "80px", marginBottom: "5px" }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Sign-in to Muawin
            </Typography>
            <Rectangle />
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <StyledTextField
              label="Email"
              variant="outlined"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <StyledTextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleMouseDownPassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <CustomButton
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </CustomButton>
          </LeftContainer>
          <RightContainer>
            <img
              src={`${process.env.PUBLIC_URL}/images/muawin_signin.jpg`}
              alt="Cheezious "
              style={{ width: "100%", height: "auto", borderRadius: "30px" }}
            />
          </RightContainer>
        </CustomPaper>
      </ContentContainer>
    </BackgroundWrapper>
  );
}

export default SignInPage;
