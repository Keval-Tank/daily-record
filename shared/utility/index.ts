import { ServiceError, type ApiResponse } from "../types";

export function createApiResponse<T>(
    success : boolean,
    data? : T,
    message? : string,
    error? : string
) : ApiResponse<T>{
    return {
        success,
        data,
        message,
        error
    }
}

export function createSuccessResponse<T>(data : T, message? : string) : ApiResponse<T> {
    return createApiResponse(true, data, message)
}

export function createErrorResponse<T>(error : string) : ApiResponse {
    return createApiResponse(false, undefined, undefined, error)
}

export function createServiceError(
    message : string,
    statusCode : number = 500,
    code? : string,
    details? : string
) : ServiceError {
    return new ServiceError(message, statusCode, code, details)
}

export function sanitizeData(input : string) {
    return input.replace(/[<>]/g, "").trim()
}

export function isValidUUID(id : string) {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    return regex.test(id);
}

export function parseEnvInt(value : string | undefined, defaultValue : number)  : number {
    if(!value) return defaultValue;
    const parsedValue = parseInt(value, 10)
    return isNaN(parsedValue) ? defaultValue  : parsedValue
}