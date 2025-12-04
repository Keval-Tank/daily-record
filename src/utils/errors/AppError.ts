export class AppError extends Error {
    statusCode : number
    explanation : any
    constructor(message:string, statusCode : number) {
        super(message);
        this.statusCode = statusCode;
        this.explanation = message
    }
}