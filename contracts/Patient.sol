// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <=0.8.0;

contract Patient {
    address private patientAddress = msg.sender;
    string private name;

    constructor() public {
        patientAddress = msg.sender;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function setName(string memory _name) public {
        name = _name;
    }

    function getPatientAddress() public view returns (address) {
        return patientAddress;
    }
}
