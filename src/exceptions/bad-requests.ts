import { ErrorCodes,HttpException } from "./root";

export class BadRequestsEception extends HttpException {
    constructor(message:string,errorCode:ErrorCodes) {
        super(message,errorCode,400,null);
    }
}