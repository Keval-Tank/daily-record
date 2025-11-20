export type UserDetails = {
    id : string
    name : string
}

export type AddFundResult = {
    id : string
    balance : number
}

export type GetBalanceResult = {
    id : string
    name : string
    balance : number
    createdOn : string
}

export type TransactionResult = {
    sender : string,
    reciever : string,
    amount  :number
}