export interface TagValidationResponse {
    validTags : Array<{
        id : string,
        name : string,
        color? : string,
        userId? : string,
        updatedAt : Date
    }>,
    invalidTags : string[]
}

