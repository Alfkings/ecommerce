

export class HttpException extends Error{
    message: string;
    errorCode:any;
    statusCode:number;
    errors:ErrorCodes;

    constructor(message:string,errorCode:ErrorCodes,statusCode:number,error:any){
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = error;
    }
}
export enum ErrorCodes {
    USER_NOT_FOUND = 404,
    USER_ALREADY_EXISTS=409,
    INCORRECT_PASSWORD =401,
    ADDRESS_NOT_FOUND =404,
    ADDRESS_DOES_NOT_BELONG_TO_USER =419,
    UNPROCESSABLE_ENTITY=422,
    INTERNAL_EXCEPTION=500,
    UNAUTHORIZED = 402,
    PRODUCT_NOT_FOUND = 404,
    ORDER_NOT_FOUND = 414,
}