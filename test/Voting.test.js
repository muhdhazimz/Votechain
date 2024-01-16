const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  let votingInstance;

  beforeEach(async () => {
    votingInstance = await Voting.new();
  });

  it("should initialize with correct values", async () => {
    const owner = await votingInstance.owner();
    assert.equal(owner, accounts[0], "Owner is not set correctly");

    const state = await votingInstance.electionState();
    assert.equal(state, 0, "Initial state should be NotStarted");
  });

  it("should allow the owner to add candidates", async () => {
    await votingInstance.addCandidate("Anwar");
    const candidateDetails = await votingInstance.getCandidateDetails(1);
    assert.equal(candidateDetails[0], "Anwar", "Candidate not added successfully");
  });

  it("should allow a registered voter to cast a vote", async () => {
    await votingInstance.registerVoter(accounts[1]);
    await votingInstance.initiateElection();
    await votingInstance.castVote(0, { from: accounts[1] });
    await votingInstance.concludeElection();

    // Retrieve the result without destructuring
    const result = await votingInstance.getCandidateDetails(0);

    // Log the result for debugging
    console.log("Result:", result);

    // Assuming 'result' structure: ['Anwar', 1]
    // Get the candidate name and vote count
    const candidateName = result[0];
    const voteCountForAnwar = result[1].toNumber();

    // Now, you can make your assertion
    assert.equal(voteCountForAnwar, 1, "Vote not cast successfully for Anwar");
  });

  // Add more tests based on your contract's functions and requirements
});
