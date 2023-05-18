import { Types } from "mongoose";

export interface ICandidate {
    firstName:string;
    lastName: string;
    email: string;
    contact: string;
    license: string;
    DOB: Date;
    address: Types.ObjectId
    recruiter: Types.ObjectId
};

export interface IAddress {
    houseNo:string;
    streetNo: string;
    city: string;
    state: string;
    pincode: string;
};

export interface IReport {
    status:string;
    adjudication: string;
    completedAt: Date;
    tat: string;
    candidate: Types.ObjectId;
};

export interface IRecruiter {
    name:string;
    email: string;
    password: string;
    company: string;
    phone: string;
};

export interface IAdverse {
    name: string;
    status:string;
    pre_notice_date: Date;
    post_notice_date: Date;
    candidate: Types.ObjectId;
};

export interface ICourtSearch {
    status: string;
    date: Date
}

export interface ICourtSearches {
    ssn_verification: ICourtSearch;
    sex_offender: ICourtSearch;
    global_watchlist: ICourtSearch;
    federal_criminal: ICourtSearch;
    country_criminal: ICourtSearch;
    candidate: Types.ObjectId;
};

export interface JwtPayload {
    userId: string;
    email: string;
}