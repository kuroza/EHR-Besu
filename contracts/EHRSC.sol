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
        uint256 requestCount;
        mapping(uint256 => Request) requests;
    }

    struct Request {
        address requester;
        uint256 bundleNumber;
    }

    mapping(address => Person) public persons;

    function registerDoctor(string memory _name) public payable {
        require(!persons[msg.sender].registered, "Person already registered");
        Person storage doctor = persons[msg.sender];
        doctor.personAddress = msg.sender;
        doctor.name = _name;
        doctor.registered = true;
        doctor.verifiedDoctor = true;
        doctor.verifiedPatient = false;
    }

    function registerPatient(string memory _name) public payable {
        require(!persons[msg.sender].registered);
        Person storage patient = persons[msg.sender];
        patient.personAddress = msg.sender;
        patient.name = _name;
        patient.registered = true;
        patient.verifiedDoctor = false;
        patient.verifiedPatient = true;
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
        payable
    {
        require(persons[msg.sender].verifiedDoctor);
        // require(persons[patientAddress].verifiedPatient); // TODO: document must exist

        Request memory request;
        request.requester = msg.sender;
        request.bundleNumber = bundleNumber;

        uint256 count = persons[patientAddress].requestCount;
        count++;
        persons[patientAddress].requests[count] = request;
        persons[patientAddress].requestCount = count;
    }

    function checkPatientDocumentRequests() public view returns (uint256) {
        require(persons[msg.sender].verifiedPatient, "Must be a patient");
        return persons[msg.sender].requestCount; // test checking how many requests are there
        // TODO: check the contains of requests object array
    }

    // TODO: function: RA verifies patient and doctor
    // TODO: function: Patient allow access to doctor or send re-encryption keys to NuCypher network
}
