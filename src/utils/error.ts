import { NextFunction, Request, Response } from "express";

export const errorResponse = (error: any , req: Request , res: Response, next: NextFunction) => {
	const { status, message, data } = error;

    const newStatus = status ? status : 500
    const newMessage = message ? message : 'Unexpected error has occured'

	res.status(newStatus).json({ message: newMessage, data: data });
}