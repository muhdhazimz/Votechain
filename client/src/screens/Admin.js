import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import CandidateForm from "../components/CandidateForm";
import VotersForm from "../components/VotersForm";

const backgroundImage =
  "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function Admin({ role, contract, web3, currentAccount }) {
  const [electionState, setElectionState] = useState(0);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);

  const [open, setOpen] = useState(false);

  const getCandidates = async () => {
    if (contract) {
      console.log(contract);
      const count = await contract.methods.totalCandidates().call();
      const temp = [];
      for (let i = 0; i < count; i++) {
        const candidate = await contract.methods.getCandidateDetails(i).call();
        temp.push({ name: candidate[0], votes: candidate[1] });
      }
      setCandidates(temp);
      setLoading(false);
      console.log(temp);
    }
  };

  const getElectionState = async () => {
    if (contract) {
      const state = await contract.methods.electionState().call();
      setElectionState(parseInt(state));
    }
  };

  useEffect(() => {
    getElectionState();
    getCandidates();
  }, [contract]);

  const handleEnd = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = async () => {
    if (electionState === 0) {
      try {
        if (contract) {
          await contract.methods.initiateElection().send({ from: currentAccount });
          getElectionState();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else if (electionState === 1) {
      try {
        if (contract) {
          await contract.methods.concludeElection().send({ from: currentAccount });
          getElectionState();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    setOpen(false);
  };

  return (
    
    <Box
     sx={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1477281765962-ef34e8bb0967?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
    }}
    >
      <br />
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          Loading...
        </Box>
      ) : (
        <><Box
            sx={{
              width: "50%", // Adjust the width as needed
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: "maroon", // Set the background color to white
              padding: "20px", // Add padding for better visibility
              opacity: 0.9, // Darken the background image a bit
              borderRadius: "20px",
            }}
          >
            <Grid container sx={{ mt: -4 }} spacing={4}>
              <Grid item xs={12}>
                <Typography align="center" variant="h5" fontWeight="bold">
                  {electionState === 0 && "ADD VOTERS / CANDIDATES"}
                  {electionState === 1 && "SEE LIVE RESULTS"}
                  {electionState === 2 && "FINAL ELECTION RESULT"}
                </Typography>
              </Grid>

              {electionState === 0 && (
                <Grid
                  item
                  xs={12}
                  sx={{
                    overflowY: "hidden",
                    overflowX: "auto",
                    display: "flex",
                    width: "98vw",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <VotersForm
                      contract={contract}
                      web3={web3}
                      currentAccount={currentAccount} />
                    <CandidateForm
                      contract={contract}
                      web3={web3}
                      currentAccount={currentAccount} />
                  </Box>
                </Grid>
              )}

              {electionState > 0 && electionState < 2 && (
                <Table
                sx={{
                  width: "50%",
                  borderCollapse: "collapse",
                  textAlign: "center",
                  fontSize: "18px",
                  backgroundColor: "white",
                  color: "black", // Add this line to set text color
                  margin: "auto",
                  marginTop: "20px",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "black", border: "1px solid #ddd", textAlign: "center" }}>Index</TableCell>
                    <TableCell sx={{ color: "black", border: "1px solid #ddd", textAlign: "center" }}>Candidate Name</TableCell>
                    <TableCell sx={{ color: "black", border: "1px solid #ddd", textAlign: "center" }}>Vote Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {candidates
                    .slice()
                    .sort((a, b) => b.votes - a.votes)
                    .map((candidate, index) => (
                      <TableRow key={index + 1}>
                        <TableCell sx={{ color: "black", border: "1px solid #ddd", textAlign: "center" }}>{index + 1}</TableCell>
                        <TableCell sx={{ color: "black", border: "1px solid #ddd", textAlign: "center" }}>{candidate.name}</TableCell>
                        <TableCell sx={{ color: "black", border: "1px solid #ddd", textAlign: "center" }}>{candidate.votes}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              )}
            </Grid>
          </Box><Box
            sx={{
              width: "50%", // Adjust the width as needed
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "20px",
              backgroundColor: "maroon", // Set the background color to white
              padding: "20px", // Add padding for better visibility
              opacity: 0.9, // Darken the background image a bit
              borderRadius: "20px",
            }}
          >
              <Grid container sx={{ mt: 0 }} spacing={4}>

                <Grid item xs={12}>
                  <Typography align="center" variant="h5" fontWeight="bold">
                    ELECTION STATUS :{" "}
                    {electionState === 0 && "Not Started"}
                    {electionState === 1 && "In Progress"}
                    {electionState === 2 && "Ended"}
                  </Typography>
                </Grid>
                {electionState !== 2 && (
                  <Grid item xs={12} sx={{ display: "flex" }}>
                    <Button
                      variant="contained"
                      sx={{ width: "40%", margin: "auto", backgroundColor: "black", color: "white"}}
                      onClick={handleEnd}
                    >
                      {electionState === 0 && "Start Election"}
                      {electionState === 1 && "End Election"}
                    </Button>
                  </Grid>
                )}
                {electionState === 2 && (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      overflowY: "hidden",
                      overflowX: "auto",
                      display: "flex",
                      width: "98vw",
                      justifyContent: "center",
                    }}
                  >
                    <Table
                      sx={{
                        width: "50%",
                        borderCollapse: "collapse",
                        textAlign: "center",
                        fontSize: "18px",
                        backgroundColor: "white",
                        color: "black", // Add this line to set text color
                        margin: "auto",
                        marginTop: "20px",
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: "black", border: "1px solid #ddd", textAlign: "center" }}>Index</TableCell>
                          <TableCell sx={{ color: "black", border: "1px solid #ddd", textAlign: "center" }}>Candidate Name</TableCell>
                          <TableCell sx={{ color: "black", border: "1px solid #ddd", textAlign: "center" }}>Vote Count</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {candidates
                          .slice()
                          .sort((a, b) => b.votes - a.votes)
                          .map((candidate, index) => (
                            <TableRow key={index+1}>
                              <TableCell sx={{ color: "black", border: "1px solid #ddd", textAlign: "center" }}>{index+1}</TableCell>
                              <TableCell sx={{ color: "black", border: "1px solid #ddd", textAlign: "center" }}>{candidate.name}</TableCell>
                              <TableCell sx={{ color: "black", border: "1px solid #ddd", textAlign: "center" }}>{candidate.votes}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>


                    </Table>
                  </Grid>
                )}
              </Grid>

              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {electionState === 0 && "Do you want to start the election?"}
                    {electionState === 1 && "Do you want to end the election?"}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>No</Button>
                  <Button onClick={handleAgree} autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </Box></>
      )}
      <br />
    </Box>  
  );
}