const EHRSC = artifacts.require("EHRSC");

contract("EHRSC", () => {
    let result = null;
    let instance = null;
    let accounts = null;

    before(async () => {
        accounts = await web3.eth.getAccounts();
    });

    it("Should deploy smart contract properly", async () => {
        instance = await EHRSC.deployed();
        assert(instance.address !== '');
    });

    it("Should return the owner of the contract", async () => {
        const owner = await instance.getOwner();
        assert.equal(owner, accounts[0]);
    });

    it("Should register a RA admin and get admin's name", async () => {
        await instance.registerRegulatoryAgencyAdmin("RA admin Alice", {
            from: accounts[0],
        });
        result = await instance.getName({
            from: accounts[0],
        })
        assert.equal(result, "RA admin Alice");
    });

    it("Should verify the regulatory agency admin by the owner of the contract", async () => {
        await instance.verifyByOwner(accounts[0], {
            from: accounts[0],
        });
        result = await instance.isVerifiedRAAdmin({
            from: accounts[0],
        });
        assert(result == true);
    });

    it("Should register a doctor and get doctor's name", async () => {
        await instance.registerDoctor("Dr. Bob", {
            from: accounts[1],
        });
        result = await instance.getName({
            from: accounts[1],
        });
        assert.equal(result, "Dr. Bob");
    });

    it("Should verify the doctor by the RA admin properly", async () => {
        await instance.regulatoryAgencyAdminVerify(accounts[1], {
            from: accounts[0],
        });
        result = await instance.isVerifiedDoctor({
            from: accounts[1],
        });
        assert(result == true);
    });
    
    it("Should register a patient and get patient's name", async () => {
        await instance.registerPatient("Patient Carol", {
            from: accounts[2],
        });
        result = await instance.getName({
            from: accounts[2],
        });
        assert.equal(result, "Patient Carol");
    });
    
    it("Should verify the patient by the RA admin properly", async () => {
        await instance.regulatoryAgencyAdminVerify(accounts[2], {
            from: accounts[0],
        });
        result = await instance.isVerifiedPatient({
            from: accounts[2],
        });
        assert(result == true);
    });

    it("Should send the documents request to patient", async () => {
        await instance.requestDocuments(accounts[2], 23, {
            from: accounts[1],
        });
    });

    it("Should request appointment properly by patient", async () => {
        await instance.requestAppointment("Arm pain", "RIPAS", 0, 0, {
            from: accounts[2],
        });
    });

    it("Should check patient's request at given index", async () => {
        await instance.checkPatientRequestAtIndex(0, {
            from: accounts[2],
        });
    });

    it("Should check patient's request count", async () => {
        await instance.checkPatientRequestCount({
            from: accounts[2],
        });
    });
});