import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";

// Define a custom request interface
interface CustomRequest extends Request {
    user?: any;
}
const adminMiddleware =async (req:CustomRequest,res:Response,next:NextFunction)=>{

const user =req.user
if(user.role == 'ADMIN'){
    next()
}else{
   next(new UnauthorizedException('Unauthorized',ErrorCodes.UNAUTHORIZED)) 
}

}


export default adminMiddleware