// SPDX-License-Identifier: MIT
// pragma solidity >=0.4.22 <0.8.0;
pragma solidity >=0.7.0 <0.9.0;

contract EHRSC {
    string public functionCalled;

    struct Person {
        address personAddress;
        string name;
        bool registered;
        bool verifiedDoctor;
        bool verifiedPatient;
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

    struct Appointment {
        string reason;
        string venue;
        uint256 date;
        uint256 time; // time object?
    }

    // struct HealthRecord {}
    // struct Hospital {}

    mapping(address => Person) public persons;

    event DoctorRegistered(Person doctor);
    event PatientRegistered(Person patient);
    // event DoctorVerified(Person doctor);
    // event PatientVerified(Person patient);
    event RequestedDocuments(Request newRequest, address patientAddress);
    event RequestedAppointment(Appointment newAppointment);

    modifier onlyDoctor() {
        require(persons[msg.sender].verifiedDoctor);
        _;
    }

    modifier onlyPatient() {
        require(persons[msg.sender].verifiedPatient, "Must be a patient");
        _;
    }

    modifier onlyRegistered() {
        require(!persons[msg.sender].registered, "Person already registered");
        _;
    }

    function registerDoctor(string memory _name) public onlyRegistered {
        Person storage doctor = persons[msg.sender];
        doctor.personAddress = msg.sender;
        doctor.name = _name;
        doctor.registered = true;
        doctor.verifiedDoctor = true;
        doctor.verifiedPatient = false;
        // gender, email, nationality, etc.
        emit DoctorRegistered(doctor);
    }

    function registerPatient(string memory _name) public onlyRegistered {
        Person storage patient = persons[msg.sender];
        patient.personAddress = msg.sender;
        patient.name = _name;
        patient.registered = true;
        patient.verifiedDoctor = false;
        patient.verifiedPatient = true;
        patient.requestCount = 0;
        // patient info
        // IC for locals / passport for foreigners
        // contact and home address
        // related contacts
        // employment details
        emit PatientRegistered(patient);
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
        // require(persons[patientAddress].verifiedPatient); // TODO: document must exist
        uint256 count = persons[_patientAddress].requestCount; // used for tracking request count
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

    function requestAppointment(string memory _reason) public onlyPatient {
        Appointment memory newAppointment = Appointment(_reason, "", 0, 0);
        persons[msg.sender].appointments.push(newAppointment);
        emit RequestedAppointment(newAppointment);
    }

    fallback() external {
        functionCalled = "fallback";
    }

    // TODO: function: RA verifies patient and doctor
    // TODO: function: Patient allow access to doctor or send re-encryption keys to NuCypher network
}
