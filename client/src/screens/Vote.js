import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

import Candidate from "../components/CandidateCard";

export default function Vote({ role, contract, web3, currentAccount }) {
  const [candidates, setCandidates] = useState([]);
  const [vote, setVote] = useState(null);
  const [electionState, setElectionState] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);

  const getCandidates = async () => {
    if (contract) {
      const count = await contract.methods.totalCandidates().call();
      const temp = [];
      for (let i = 0; i < count; i++) {
        const candidate = await contract.methods.getCandidateDetails(i).call();
        temp.push({ name: candidate[0], votes: candidate[1] });
      }
      setCandidates(temp);
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

  const handleVoteChange = (event) => {
    setVote(event.target.value);
  };

  const handleVote = async (event) => {
    event.preventDefault();
    try {
      if (contract && currentAccount) {
        await contract.methods.castVote(vote).send({ from: currentAccount });
        setHasVoted(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box
    sx={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1477281765962-ef34e8bb0967?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
    }}>
      <form onSubmit={handleVote}>
        <Grid container sx={{ mt: 0 }} spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <Typography align="center" variant="h5" fontWeight="bold">
              {electionState === 0 &&
                <>Kindly await the commencement of the election. At present, the election has not yet started. <br />
                Please check back for updates on the official start time. Thank you.<br /><br />
                </>}
              {electionState === 1 && hasVoted && (
                <>
                  You have already voted. Thank you.
                  <br />
                  Please wait for the election to end to view the results.
                  <br /><br />
                </>
              )}
              </Typography>
              <Box
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
              <Typography align="center" variant="h5" fontWeight="bold" color="white">
              {electionState === 1 &&
                !hasVoted &&
                "VOTE FOR YOUR CANDIDATE"}
              {electionState === 2 &&
                "Election has ended. See the results below."}
              </Typography>
              </Box>
          </Grid>
          {electionState === 1 && !hasVoted && (
            <>
              <Grid item xs={12}>
                <FormControl>
                  <RadioGroup
                    row
                    sx={{
                      overflowY: "hidden",
                      overflowX: "auto",
                      display: "flex",
                      width: "98vw",
                      justifyContent: "center",
                    }}
                    value={vote}
                    onChange={handleVoteChange}
                  >
                    {candidates.map((candidate, index) => (
                      <FormControlLabel
                        key={index}
                        labelPlacement="top"
                        control={<Radio />}
                        value={index}
                        label={<Candidate id={index} name={candidate.name} />}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "center" }}>
                <div style={{ margin: 30 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{width: "30%", backgroundColor: "black", color: "white" }}
                  >
                    Vote
                  </Button>
                </div>
              </Grid>
            </>
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
            <Box
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
            <Table
              sx={{
                width: "80%",
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
            </Box>
            </Grid>
          )}
        </Grid>
      </form>
      <br /><br /><br />
    </Box>
  );
}
