// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract EHRSC {
    // address[] private persons;
    address private doctor;
    // mapping(address => Person) public persons;

    struct Person {
        bool registered;
    }

    constructor() public {
        doctor = 0x4256472057Bf645F995DD8EF24480C367e154bE7;
        // doctor = 0x2a230D5b4557C27a777095f5329C0F172457b157;
        // persons.push('0x2a230D5b4557C27a777095f5329C0F172457b157');
    }

    function requestDocuments() public view returns (string memory) {
        // require(
        //     persons[msg.sender].registered,
        //     "Unregistered person cannot call this function"
        // );
        if (doctor == msg.sender) return "Documents retrieved";
        else return "Doctor not registered";
    }

    // function getName() public view returns (string memory) {
    //     return name;
    // }

    // function setName(string memory _name) public {
    //     name = _name;
    // }

    // function getPatientAddress() public view returns (address) {
    //     return patientAddress;
    // }
}
