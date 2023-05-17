import { ValidationError } from 'express-validator';
import express from '.';
import * as jwt from 'jsonwebtoken'

declare global {
	namespace Express {
		export interface Request {
			user: Record<string, any>;
			userId: string;
			token: string | jwt.JwtPayload;
		}
	}
	export interface Error {
		statusCode?: number;
		data?: ValidationError[];
	}
}

declare module 'jsonwebtoken' {
    export interface UserDetailsJwtPayload extends jwt.JwtPayload {
        userId: string,
		email: string,
    }
}