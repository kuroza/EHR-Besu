// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract EHRSC {
    address public owner;
    string public functionCalled;

    mapping(address => Person) public persons;

    enum EntityClaim {
        REGULATORY_AGENCY_ADMIN,
        DOCTOR,
        PATIENT
    }

    event DoctorRegistered(Person doctor);
    event PatientRegistered(Person patient);
    event RegulatoryAgencyAdminRegistered(Person regulatoryAgencyAdmin);
    event DoctorVerified(Person doctor);
    event PatientVerified(Person patient);
    event RegulatorAgencyAdminVerified(Person regulatoryAgencyAdmin);
    event RequestedDocuments(Request newRequest, address patientAddress);
    event RequestedAppointment(Appointment newAppointment);

    struct Appointment {
        string reason;
        string venue;
        uint256 date;
        uint256 time;
    }

    struct Person {
        address personAddress;
        string name;
        EntityClaim entityClaim;
        bool registered;
        bool verifiedDoctor;
        bool verifiedPatient;
        bool verifiedRegulatoryAgencyAdmin;
        uint256 requestCount;
        Request[] requests;
        Appointment[] appointments;
        // mapping(uint256 => HealthRecord) healthRecords;
    }

    struct Request {
        uint256 requestNo;
        address requester;
        uint256 bundleNumber;
    }

    // struct RegulatoryAgencyAdmin {}
    // struct HealthRecord {}
    // struct Hospital {}

    modifier onlyDoctor() {
        require(persons[msg.sender].verifiedDoctor, "Must be a doctor");
        _;
    }

    modifier onlyPatient() {
        require(persons[msg.sender].verifiedPatient, "Must be a patient");
        _;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Must be an owner");
        _;
    }

    modifier onlyRegulatoryAgencyAdmin() {
        require(
            persons[msg.sender].verifiedRegulatoryAgencyAdmin,
            "Must be a regulatory agency admin"
        );
        _;
    }

    modifier onlyRegistered() {
        require(!persons[msg.sender].registered, "Person already registered");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerDoctor(string memory _name) public onlyRegistered {
        Person storage doctor = persons[msg.sender];
        doctor.personAddress = msg.sender;
        doctor.name = _name;
        doctor.entityClaim = EntityClaim.DOCTOR;
        doctor.registered = true;
        doctor.verifiedDoctor = false;
        doctor.verifiedPatient = false;
        doctor.verifiedRegulatoryAgencyAdmin = false;
        // gender, email, nationality, etc.
        emit DoctorRegistered(doctor);
    }

    function registerPatient(string memory _name) public onlyRegistered {
        Person storage patient = persons[msg.sender];
        patient.personAddress = msg.sender;
        patient.name = _name;
        patient.entityClaim = EntityClaim.PATIENT;
        patient.registered = true;
        patient.verifiedDoctor = false;
        patient.verifiedPatient = false;
        patient.verifiedRegulatoryAgencyAdmin = false;
        patient.requestCount = 0;
        // patient info
        // IC for locals / passport for foreigners
        // contact and home address
        // related contacts
        // employment details
        emit PatientRegistered(patient);
    }

    function registerRegulatoryAgencyAdmin(string memory _name)
        public
        onlyRegistered
    {
        Person storage regulatoryAgencyAdmin = persons[msg.sender];
        regulatoryAgencyAdmin.personAddress = msg.sender;
        regulatoryAgencyAdmin.name = _name;
        regulatoryAgencyAdmin.entityClaim = EntityClaim.REGULATORY_AGENCY_ADMIN;
        regulatoryAgencyAdmin.registered = true;
        regulatoryAgencyAdmin.verifiedDoctor = false;
        regulatoryAgencyAdmin.verifiedPatient = false;
        regulatoryAgencyAdmin.verifiedRegulatoryAgencyAdmin = false;
        emit RegulatoryAgencyAdminRegistered(regulatoryAgencyAdmin);
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

    function requestDocuments(address _patientAddress, uint256 _bundleNumber)
        public
        onlyDoctor
    {
        require(persons[_patientAddress].verifiedPatient); // TODO: check document must exist
        uint256 count = persons[_patientAddress].requestCount; // tracking request count
        Request memory newRequest = Request(count, msg.sender, _bundleNumber);
        persons[_patientAddress].requests.push(newRequest);
        persons[_patientAddress].requestCount = ++count;
        emit RequestedDocuments(newRequest, _patientAddress);
    }

    function checkPatientRequestCount()
        public
        view
        onlyPatient
        returns (uint256)
    {
        return persons[msg.sender].requestCount;
    }

    function checkPatientRequestAtIndex(uint256 index)
        public
        view
        onlyPatient
        returns (Request memory)
    {
        return persons[msg.sender].requests[index];
    }

    function requestAppointment(
        string memory _reason,
        string memory _venue,
        uint256 _date,
        uint256 _time
    ) public onlyPatient {
        Appointment memory newAppointment = Appointment(
            _reason,
            _venue,
            _date,
            _time
        );
        persons[msg.sender].appointments.push(newAppointment);
        emit RequestedAppointment(newAppointment);
    }

    function verifyByOwner(address _personAddress) public onlyOwner {
        if (
            persons[_personAddress].entityClaim ==
            EntityClaim.REGULATORY_AGENCY_ADMIN
        ) {
            persons[_personAddress].verifiedRegulatoryAgencyAdmin = true;
        }
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function regulatoryAgencyAdminVerify(address _personAddress)
        public
        onlyRegulatoryAgencyAdmin
    {
        if (
            persons[_personAddress].entityClaim ==
            EntityClaim.REGULATORY_AGENCY_ADMIN
        ) {
            persons[_personAddress].verifiedRegulatoryAgencyAdmin = true;
            emit RegulatorAgencyAdminVerified(persons[_personAddress]);
        } else if (persons[_personAddress].entityClaim == EntityClaim.DOCTOR) {
            persons[_personAddress].verifiedDoctor = true;
            emit DoctorVerified(persons[_personAddress]);
        } else if (persons[_personAddress].entityClaim == EntityClaim.PATIENT) {
            persons[_personAddress].verifiedPatient = true;
            emit PatientVerified(persons[_personAddress]);
        }
    }

    fallback() external {
        functionCalled = "fallback";
    }

    // TODO: function: Patient allow access to doctor or send re-encryption keys to NuCypher network
}
