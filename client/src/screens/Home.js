import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Vote from "./Vote";
import Admin from "./Admin";
import ElectionContract from "../contracts/Voting.json";
import getWeb3 from "../utils/getWeb3";
import Typography from "@mui/material/Typography";

export default function Home() {
  const [role, setRole] = useState(2);
  const [web3, setWeb3] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadWeb3 = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ElectionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ElectionContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      setWeb3(web3);
      setCurrentAccount(accounts[0]);
      setContract(instance);
      console.log("init");
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getRole = async () => {
    if (contract) {
      const user = await contract.methods.checkUserRole(currentAccount).call();
      setRole(parseInt(user));
      console.log("role:");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    getRole();
  }, [contract]);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        height: "100vh",
      }}
    >
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
        <Box>
          {role === 1 && (
            <Admin
              role={role}
              contract={contract}
              web3={web3}
              currentAccount={currentAccount}
            />
          )}

          {role === 2 && (
            <Vote
              role={role}
              contract={contract}
              web3={web3}
              currentAccount={currentAccount}
            />
          )}

          {role === 3 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
                backgroundImage: 'url(https://images.unsplash.com/photo-1477281765962-ef34e8bb0967?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
              }}
            >
              <Typography align="center" variant="h4" fontWeight="bold">
                You are not registered as a voter.
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
