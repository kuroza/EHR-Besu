const EHRSC = artifacts.require("EHRSC");

contract("EHRSC", () => {
    let result = null;
    let instance = null;
    before(async () => {
        instance = await EHRSC.deployed();
    });

    it('Should deploy smart contract properly', async () => {
        assert(instance.address !== '');
    })
    
    it("Should get doctor's name", async () => {
        await instance.registerDoctor("Dr. Zakwan");
        result = await instance.getName();
        assert.equal(result, "Dr. Zakwan");
        // console.log(instance.address);
    })

    it("Should verify person as doctor", async () => {
        result = await instance.isVerifiedDoctor();
        assert(result === true);
    })

    it("Should not verify person as patient", async () => {
        result = await instance.isVerifiedPatient();
        assert(result === false);
    })

    it("Should send the request", async () => {
        let accounts = await web3.eth.getAccounts();
        await instance.requestDocuments(accounts[5], 23);
    })

    // it("Should return the request", async () => {
    //     let accounts = await web3.eth.getAccount();
    //     await instance.requestDocuments(accounts[5], 23);

    //     result = await instance.checkPatientRequestAtIndex(0);
    // })
})

contract ("EHRSC", () => {
    let result = null;
    let patient = null;
    before(async () => {
        patient = await EHRSC.new();
    });

    it('Should deploy smart contract properly', async () => {
        assert(patient.address !== '');
    })
    
    it("Should get patient's name", async () => {
        await patient.registerPatient("Tina");
        result = await patient.getName();
        assert.equal(result, "Tina");
        // console.log(patient.address);
    })

    it("Should verify person as patient", async () => {
        result = await patient.isVerifiedPatient();
        assert(result === true);
    })

    it("Should not verify person as doctor", async () => {
        result = await patient.isVerifiedDoctor();
        assert(result === false);
    })

    // it("Should return patient's requests count", async () => {
    //     result = await patient.checkPatientRequestCount();
    //     console.log(result);
    // })
})