// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract EHRSC {
    struct Person {
        string name;
        bool registered;
        bool verifiedDoctor;
        bool verifiedPatient;
        mapping(uint256 => Request) requests;
    }

    struct Request {
        address requester;
        uint256 documentNumber;
    }

    mapping(address => Person) public persons;

    constructor() public {}

    function registerDoctor(string memory _name) public payable {
        require(!persons[msg.sender].registered, "Person already registered");

        persons[msg.sender] = Person(_name, true, true, false);
    }

    function registerPatient(string memory _name) public payable {
        require(!persons[msg.sender].registered);

        persons[msg.sender] = Person(_name, true, false, true);
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

    // function requestDocuments(address patientAddress, uint256 documentNumber)
    //     public
    //     payable
    // {
    //     require(persons[msg.sender].verifiedDoctor);
    //     require(persons[patientAddress].verifiedPatient); // TODO: document must exist

    //     Request memory request;
    //     request.requester = msg.sender;
    //     request.documentNumber = documentNumber;

    //     persons[patientAddress].requests = request;
    // }

    // TODO: patient documents
}
