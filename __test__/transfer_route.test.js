import { expect, jest } from '@jest/globals'
import { ObjectId } from 'mongodb'

const mockUserFindOne = jest.fn()
const mockLedgerFindOne = jest.fn()
const mockLedgerDeleteOne = jest.fn()
const mockUserFindOneAndUpdate = jest.fn()
const mockLedgerUpdateOne = jest.fn()

await jest.unstable_mockModule('../middleware/db.js', () => ({
    userCollection: {
        findOne: mockUserFindOne,
        findOneAndUpdate: mockUserFindOneAndUpdate
    },
    ledgerEntry: {
        findOne: mockLedgerFindOne,
        deleteOne: mockLedgerDeleteOne,
        updateOne: mockLedgerUpdateOne
    },
    now: new Date()
}))

const { makeTransaction } = await import('../routes/makeTransaction.js')

// invalid input
it('400 on invalid sender-reciever or transfer amount', async () => {
    const sender = "68e7aaa1ed8e576fb817b934"
    const reciever = "68e7aaa1ed8e576fb817b933"
    const amount = -100

    const req = {
        body: {
            from: sender,
            to: reciever,
            amount
        }
    }

    const res = {
        status: jest.fn((x) => x),
        send: jest.fn((x) => x),
        json: jest.fn((x) => x)
    }

    await makeTransaction(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
})

// sender or reciever not found
it('404 for either user not found', async () => {
    const sender = "68e7aaa1ed8e576fb817b934"
    const reciever = "68e7aaa1ed8e576fb817b933"

    const req = {
        body: {
            from: "68e7aaa1ed8e576fb817b934",
            to: "68e7aaa1ed8e576fb817b933"
        }
    }

    const res = {
        send: jest.fn((x) => x),
        status: jest.fn((x) => x),
        json: jest.fn((x) => x)
    }

    mockUserFindOne.mockResolvedValueOnce(null)
    await makeTransaction(req, res)
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json.mock.calls[0][0]).toEqual({ "msg": "User Not Found!" })
})

// insufficient amount in sender
it('Return 409 for insufficient balance', async() => {
    const sender = "68e900ff4f3daf972e1cbf2a"
    const reciever = "68e901444f3daf972e1cbf2b"
    const amount = 200
    const req = {
        body : {
            from : sender,
            to  :reciever,
            amount
        }
    }

    const res = {
        status : jest.fn((x) => x),
        send : jest.fn((x) => x),
        json : jest.fn((x) => x)
    }

     mockUserFindOne.mockImplementationOnce(() => {
        return {
            _id: new ObjectId(sender),
            name: "Keval",
            balance: 100,
            createdOn: new Date()
        }
    }).mockImplementationOnce(() => {
        return {
            _id: new ObjectId(reciever),
            name: "Kabir",
            balance: 300,
            createdOn: new Date()
        }
    })

    await makeTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(409)
})

//proper transaction
it('200 on successfull transfer with response', async () => {
    const sender = "68e900ff4f3daf972e1cbf2a"
    const reciever = "68e901444f3daf972e1cbf2b"
    const amount = 200
    const sender_balance = 500
    const reciever_balance = 100

    const req = {
        body: {
            from: sender,
            to: reciever,
            amount
        }
    }

    const res = {
        send: jest.fn((x) => x),
        status: jest.fn((x) => x),
        json: jest.fn((x) => x)
    }

    mockUserFindOne.mockImplementationOnce(() => {
        return {
            _id: new ObjectId(sender),
            name: "Keval",
            balance: sender_balance,
            createdOn: new Date()
        }
    }).mockImplementationOnce(() => {
        return {
            _id: new ObjectId(reciever),
            name: "Kabir",
            balance: reciever_balance,
            createdOn: new Date()
        }
    }).mockImplementationOnce(() => {
        return {
            _id: new ObjectId(sender),
            name: "Keval",
            balance: sender_balance - amount,
            createdOn: new Date()
        }
    }).mockImplementationOnce(() => {
        return {
            _id: new ObjectId(reciever),
            name: "Kabir",
            balance: parseInt(reciever_balance) + parseInt(amount),
            createdOn: new Date()
        }
    })

    mockUserFindOneAndUpdate.mockImplementationOnce(() => {
        return {
            value: {
                _id: new ObjectId(sender),
                name: "Keval",
                balance: sender_balance,
                createdOn: new Date()
            },
            ok: 1
        }
    }).mockImplementationOnce(() => {
        return {
            value: {
                _id: new ObjectId(reciever),
                name: "Kabir",
                balance: reciever_balance,
                createdOn: new Date()
            },
            ok : 1
        }
    })

    await makeTransaction(req, res)
    // console.log(res.json.mock.calls[0][0]);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json.mock.calls[0][0].sender).toEqual(new ObjectId(sender))
    expect(res.json.mock.calls[0][0].reciever).toEqual(new ObjectId(reciever))
    expect(res.json.mock.calls[0][0].amount).toEqual(amount)
})


