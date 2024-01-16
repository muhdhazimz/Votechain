import * as React from "react";
import { Button, Typography, Box } from "@mui/material";
import CoverLayout from "../components/CoverLayout";
import { useNavigate } from "react-router-dom";


const backgroundImage =
  "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";


const logoImage =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_the_Malaysian_Anti-Corruption_Commission.svg/1200px-Logo_of_the_Malaysian_Anti-Corruption_Commission.svg.png";


export default function CoverPage() {
  const navigate = useNavigate();


  const handleClick = () => {
    console.log("home button clicked");
    navigate("/home");
    window.location.reload();
  };


  return (
    <CoverLayout
      sxBackground={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: "#7fc7d9", // Average color of the background image.
        backgroundPosition: "center",
        backgroundSize: "cover", // Added to make the background image cover the entire container.
      }}
    >
      {/* Increase the network loading priority of the background image. */}
        <img
          style={{ display: "none" }}
          src={backgroundImage}
          alt="increase priority"
        />
      <Box
        sx={{
          width: "40%", // Adjust the width as needed
          marginLeft: 10,
          marginRight: "auto",
          backgroundColor: "white", // Set the background color to white
          padding: "20px", // Add padding for better visibility
          opacity: 0.9, // Darken the background image a bit
          borderRadius: "20px",
        }}
      >
      <Typography
        color="black"
        align="left"
        variant="h2"
        marked="center"
        sx={{ fontWeight: "bold" }} // Added fontWeight to make the text bold
      >
      {/* Logo Image */}
      <img
          src={logoImage}
          alt="logo"
          style={{ width: "50px", marginRight: "20px" }} // Adjust the width and margin as needed
        />
        VOTECHAIN
      </Typography>
      <Typography
        color="black"
        align="left"
        variant="h5"
        sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
      >
        Welcome to VOTECHAIN, a cutting-edge decentralized voting system meticulously crafted on the Ethereum blockchain. We bring forth a revolutionary approach to voting, fostering transparency, security, and unwavering integrity.
      </Typography>
      <Button
        color="primary" // Changed to primary color for better visibility
        variant="contained"
        size="large"
        sx={{ mb: 4, maxWidth: 400, marginLeft: 0 }}
        onClick={handleClick}
      >
        Login Using Metamask Account
      </Button>
      </Box>
    </CoverLayout>
  );
}
