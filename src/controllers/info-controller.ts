import { type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";

const infoController = (req : Request, res : Response) => {
    return res.status(StatusCodes.OK).json({
        isCompleted : true,
        on : Date.now().toString()
    })
}

export default infoController