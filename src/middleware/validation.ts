import { body } from "express-validator";
import Recruiter from "../models/recruiter";
import candidate from "../models/candidate";

export const validateSignup = 
    [
		body('email', 'Please enter a valid email.')
			.isEmail()
			.custom(async (value) => {
				const user = await Recruiter.findOne({ email: value }).exec();
				if (user) return Promise.reject('Email address already exists!');
			})
			.normalizeEmail(),
		body('password', 'Password should have a minimum of 5 characters!')
			.trim()
			.isLength({ min: 5 }),
		body('name', 'Name is required').trim().notEmpty(),
        body('phone', 'Phone number is required')
        .trim()
        .isMobilePhone('en-IN'),
        body('company', 'Company Name is required').trim().notEmpty(),

];

export const validateLogin = [
		body('email', 'Please enter a valid email.').isEmail().normalizeEmail(),
		body('password', 'Password should have a minimum of 5 characters!')
			.trim()
			.isLength({ min: 5 }),
]

export const validateCandidate = [
body('email', 'Please enter a valid email.')
    .isEmail()
    .custom(async (value) => {
        const user = await candidate.findOne({ email: value }).exec();
        if (user) return Promise.reject('Email address already exists!');
    })
    .normalizeEmail(),
body('firstName', 'First Name is required').trim().notEmpty(),
body('lastName', 'Last Name is required').trim().notEmpty(),
body('contact', 'Phone number is required')
	.trim()
		.isMobilePhone('en-IN'),
body('houseNo', 'house No is required').trim().notEmpty(),
body('city', 'city is required').trim().notEmpty(),
body('state', 'state is required').trim().notEmpty(),
body('pincode', 'pincode is required').trim().notEmpty(),
];

export const validateAdverse = [
body('status', 'status is required').trim().notEmpty(),
body('name', 'Name is required').trim().notEmpty(),
body('pre_notice_date', 'pre_notice_date is required').trim().notEmpty(),
body('post_notice_date', 'post_notice_date is required').trim().notEmpty(),
];

export const validateCourtSearch = [
	body('ssn_verification', 'ssn_verification is required').notEmpty(),
	body('sex_offender', 'sex_offender is required').notEmpty(),
	body('global_watchlist', 'global_watchlist is required').notEmpty(),
	body('federal_criminal', 'federal_criminal is required').notEmpty(),
	body('country_criminal', 'country_criminal is required').notEmpty(),
];

export const validateReport = [
	body('status', 'status is required').trim().notEmpty(),
	body('adjudication', 'adjudication is required').trim().notEmpty(),
	body('completedAt', 'completedAt is required').trim().notEmpty(),
	body('tat', 'turn around time is required').trim().notEmpty(),
];