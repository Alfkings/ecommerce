import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsEception } from "../exceptions/bad-requests";
import { ErrorCodes } from "../exceptions/root";
import { SignUpSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";

// Define a custom request interface
interface CustomRequest extends Request {
    user?: any;
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    SignUpSchema.parse(req.body);
    const { name, email, password } = req.body;
    try {
        let user = await prismaClient.user.findFirst({
            where: { email }
        });
        if (user) {
            next(new BadRequestsEception('User already exists!', ErrorCodes.USER_ALREADY_EXISTS));
            return;
        }
        user = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10)
            }
        });
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
        let user = await prismaClient.user.findFirst({
            where: { email }
        });
        if (!user) {
            throw new NotFoundException('User Not Found', ErrorCodes.USER_NOT_FOUND);
        }
        if (!compareSync(password, user.password)) {
            throw new BadRequestsEception("Incorrect Password", ErrorCodes.INCORRECT_PASSWORD);
        }
        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        next(error);
    }
};

export const me = async (req: CustomRequest, res: Response) => {
    res.status(201).json(req.user);
};
