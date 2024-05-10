import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

// Define a custom request interface
interface CustomRequest extends Request {
    user?: any;
}

const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED);
    }

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await prismaClient.user.findUnique({ where: { id: parseInt(payload.userId) } });

    if (!user) {
      throw new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED);
    }

    // Assign the user object to the user property of the request
    req.user = user;

    next();
  } catch (error) {
    next(error instanceof UnauthorizedException ? error : new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED));
  }
};

export default authMiddleware;
