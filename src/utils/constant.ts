export const RECRUITER_DATA = {
            email: 'test@checkr.com',
            name: 'Test Recruiter',
            phone: 9675648978,
            company:"Test company"
};
export const LOGIN_CRED = {
     email: 'test@checkr.com',
     password: 'password'
};
export const CANDIDATE_DATA = {
        firstName: "sam",
        lastName: "last",
        email: "sam@example.com",
        contact: "9867546324",
        license: "ABC123",
        DOB: "1990-01-01",
};

export const CANDIDATE_ADVERSE = {
            name:'sam',
            status:'clear',
            pre_notice_date:'1990-01-01',
            post_notice_date:'1990-02-02',
}

export const CANDIDATE_ADDRESS = {
        houseNo: "1",
        streetNo: "456",
        city: "City",
        state: "State",
        pincode: "123456",
};

export const CANDIDATE_REPORT = {
    status:'status',
    adjudication:'adjudication',
    completedAt:'1990.01.01',
    tat:'2h',
}

export const COURT_SEARCH_DATA = {
    ssn_verification:{
        "status":"clear",
        "date":"2022-01-01"
    },
    sex_offender:{
        "status":"clear",
        "date":"2022-02-02"
    },
    global_watchlist:{
        "status":"consider",
        "date":"2022-03-03"
    },
    federal_criminal:{
        "status":"clear",
        "date":"2022-04-04"
    },
    country_criminal:{
        "status":"consider",
        "date":"2022-04-05"
    }
};

export const NOT_AUTHENTICATED = 'Not authenticated.';
export const VALIDATION_FAILED = 'Validation failed.';
export const ADVERSE_LIST_SUCCESS = 'Adverse action list fetched Successfully';
export const ADVERSE_ALREADY_EXIST = 'Adverse action already exists for candidate id ';
export const ADVERSE_ADD = 'Candidate adverse Report added successfully';


export const RECRUITER_ADDED = "Recruiter added successfully";
export const RECRUITER_NOT_FOUND= "A recruiter could not be found with email: "
export const WRONG_PASSWORD = "Wrong password!! Please try again.";

export const CANDIDATE_LIST = "Candidates fetched Successfully";
export const CANDIDATE_ADDED = "Candidate added successfully";
export const CANDIDATE_NOT_FOUND = "Could not find candidate with id: ";
export const CANDIDATE_ADDRESS_NOT_FOUND = 'Could not find address of candidate with id: ';
export const CANDIDATE_UPDATED = "Candidate details updated Successfully";
export const CANDIDATE_DELETED = "Candidate deleted";


export const COURT_SEARCH_LIST = "Court search report of all candidates fetched Successfully";
export const COURT_SEARCH_EXIST = "Report already exists for candidate id ";
export const COURT_SEARCH_ADDED = "Candidate court search Report added successfully";
export const COURT_SEARCH_NOT_FOUND = "Could not find candidate report with id: ";
export const COURT_SEARCH_FOUND = "Candidate report fetched Successfully";
export const COURT_SEARCH_DELETED = "Candidate report deleted successfully!!";
export const COURT_SEARCH_UPDATED = "Candidate report updated Successfully";


export const RECRUITER_LIST = "All recruiters fetched Successfully";
export const RECRUITER_NOT_FOUND_MSSG = "Could not find recruiter  with id: ";
export const RECRUITER_FOUND = "Recruiter fetched Successfully";
export const RECRUITER_DELETED = "Recruiter deleted Successfully";

export const REPORT_LIST = "Report of all candidates fetched Successfully";
export const REPORT_EXIST = "Report already exists for candidate id "
export const REPORT_ADDED= "Candidate Report added successfully"
export const REPORT_NOT_FOUND= "Could not find candidate report with id: ";
export const REPORT_FOUND= "Candidate report fetched Successfully";
export const REPORT_UPDATE= "Candidate report updated Successfully";

