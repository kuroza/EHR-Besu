// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract EHRSC {
    address public owner;

    mapping(address => Person) public persons;

    enum EntityClaim {
        REGULATORY_AGENCY_ADMIN,
        DOCTOR,
        PATIENT,
        INSURANCE_COMPANY_ADMIN
    }

    event DoctorRegistered(Person doctor);
    event PatientRegistered(Person patient);
    event RegulatoryAgencyAdminRegistered(Person regulatoryAgencyAdmin);
    event InsuranceCompanyAdminRegistered(Person insuranceCompanyAdmin);
    event DoctorVerified(Person doctor);
    event PatientVerified(Person patient);
    event RegulatorAgencyAdminVerified(Person regulatoryAgencyAdmin);
    event InsuranceCompanyAdminVerified(Person insuranceCompanyAdmin);
    event RequestedBundle(Request newRequest, address patientAddress);
    event RequestedAppointment(Appointment newAppointment);

    struct Appointment {
        string reason;
        string venue;
        uint256 date;
        uint256 time;
    }

    struct Person {
        address personAddress;
        // add Umbral public key
        string name;
        EntityClaim entityClaim;
        bool registered;
        bool verifiedDoctor;
        bool verifiedPatient;
        bool verifiedRegulatoryAgencyAdmin;
        bool verifiedInsuranceCompanyAdmin;
        uint256 requestCount;
        Request[] requests;
        Appointment[] appointments;
        Bundle bundle;
    }

    struct Bundle {
        string bundleNumber;
        address doctorAddress;
    }

    struct Request {
        uint256 requestNo;
        address requester;
        string bundleNumber;
    }

    // struct InsuranceCompany {}
    // struct Laboratory {}
    // struct Pharmacy {}
    // struct RegulatoryAgency {}
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

    modifier onlyInsuranceCompanyAdmin() {
        require(
            persons[msg.sender].verifiedInsuranceCompanyAdmin,
            "Must be a insurance company admin"
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
        doctor.verifiedInsuranceCompanyAdmin = false;
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
        patient.verifiedInsuranceCompanyAdmin = false;
        patient.requestCount = 0;
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
        regulatoryAgencyAdmin.verifiedInsuranceCompanyAdmin = false;
        emit RegulatoryAgencyAdminRegistered(regulatoryAgencyAdmin);
    }

    function getName() public view returns (string memory) {
        return persons[msg.sender].name;
    }

    function isVerifiedRAAdmin() public view returns (bool) {
        return persons[msg.sender].verifiedRegulatoryAgencyAdmin;
    }

    function isVerifiedInsuranceCompanyAdmin() public view returns (bool) {
        return persons[msg.sender].verifiedInsuranceCompanyAdmin;
    }

    function isVerifiedDoctor() public view returns (bool) {
        return persons[msg.sender].verifiedDoctor;
    }

    function isVerifiedPatient() public view returns (bool) {
        return persons[msg.sender].verifiedPatient;
    }

    function uploadBundle(address _patientAddress, string memory _bundleNumber)
        public
        onlyDoctor
    {
        // // require verified patient
        // require(
        //     persons[_patientAddress].verifiedPatient,
        //     "Patient must be verified"
        // );

        // store which doctor uploaded the latest bundle
        Bundle memory newBundle = Bundle(_bundleNumber, msg.sender); // rather use bundleHash and msg.sender

        // assign the bundleNo to patient for reference
        persons[_patientAddress].bundle = newBundle;
    }

    function checkPatientBundleHash(address _patientAddress)
        public
        view
        returns (string memory)
    {
        return persons[_patientAddress].bundle.bundleNumber;
    }

    function requestBundle(address _patientAddress, string memory _bundleNumber)
        public
        onlyDoctor
    {
        require(
            persons[_patientAddress].verifiedPatient,
            "Patient must be verified"
        ); // TODO: check bundle must exist
        uint256 count = persons[_patientAddress].requestCount;
        Request memory newRequest = Request(count, msg.sender, _bundleNumber);
        persons[_patientAddress].requests.push(newRequest);
        persons[_patientAddress].requestCount = ++count;
        emit RequestedBundle(newRequest, _patientAddress);
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

    // deployer of the smart contract can verify RA admins
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
        } else if (
            persons[_personAddress].entityClaim ==
            EntityClaim.INSURANCE_COMPANY_ADMIN
        ) {
            persons[_personAddress].verifiedInsuranceCompanyAdmin = true;
            emit InsuranceCompanyAdminVerified(persons[_personAddress]);
        }
    }

    // TODO: function: Insurance company
    // TODO: function: Hospital accepts appointment request
    // TODO: function: Patient allow access to doctor or send re-encryption keys to NuCypher network
}
