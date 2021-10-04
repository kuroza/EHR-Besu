// SPDX-License-Identifier: MIT
// pragma solidity >=0.4.22 <0.8.0;
pragma solidity >=0.7.0 <0.9.0;

contract EHRSC {
    struct Person {
        address personAddress;
        string name;
        bool registered;
        bool verifiedDoctor;
        bool verifiedPatient;
        // mapping(uint256 => HealthRecord) healthRecords;

        uint256 requestCount;
        Request[] requests;
    }

    // struct HealthRecord {
    // }

    struct Request {
        uint256 requestNo;
        address requester;
        uint256 bundleNumber;
    }

    mapping(address => Person) public persons;

    modifier onlyDoctor() {
        require(persons[msg.sender].verifiedDoctor);
        _;
    }

    function registerDoctor(string memory _name) public {
        require(!persons[msg.sender].registered, "Person already registered");
        Person storage doctor = persons[msg.sender];
        doctor.personAddress = msg.sender;
        doctor.name = _name;
        doctor.registered = true;
        doctor.verifiedDoctor = true;
        doctor.verifiedPatient = false;
    }

    function registerPatient(string memory _name) public {
        require(!persons[msg.sender].registered, "Person already registered");
        Person storage patient = persons[msg.sender];
        patient.personAddress = msg.sender;
        patient.name = _name;
        patient.registered = true;
        patient.verifiedDoctor = false;
        patient.verifiedPatient = true;
        patient.requestCount = 0;
    }

    function getName() public view returns (string memory) {
        return persons[msg.sender].name;
    }

    function isVerifiedDoctor() public view returns (bool) {
        return persons[msg.sender].verifiedDoctor;
    }

    function isVerifiedPatient() public view returns (bool) {
        return persons[msg.sender].verifiedPatient;
    }

    function requestDocuments(address patientAddress, uint256 bundleNumber)
        public
        onlyDoctor
    {
        // require(persons[patientAddress].verifiedPatient); // TODO: document must exist

        uint256 count = persons[patientAddress].requestCount;
        Request memory newRequest = Request(count, msg.sender, bundleNumber);
        persons[patientAddress].requests.push(newRequest);
        persons[patientAddress].requestCount = ++count;
    }

    function checkPatientRequestCount() public view returns (uint256) {
        require(persons[msg.sender].verifiedPatient, "Must be a patient");
        return persons[msg.sender].requestCount;
    }

    function checkPatientRequestAtIndex(uint256 index)
        public
        view
        returns (Request memory)
    {
        require(persons[msg.sender].verifiedPatient, "Must be a patient");
        return persons[msg.sender].requests[index];
    }

    // TODO: function: Patient register for appointment to hospital
    // TODO: function: RA verifies patient and doctor
    // TODO: function: Patient allow access to doctor or send re-encryption keys to NuCypher network
}
