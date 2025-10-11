import { jest } from '@jest/globals'
import { ObjectId } from 'mongodb'

const mockFindOne = jest.fn()
const mockFindOneAndUpdate = jest.fn()
await jest.unstable_mockModule('../middleware/db.js', () => ({
    userCollection: {
        findOne: mockFindOne,
        findOneAndUpdate: mockFindOneAndUpdate
    }
}))


const { addFund } = await import('../routes/addFund.js')

it('Return 400 for invalid input data', async () => {
    const req = {
        body: {
            id: '',
            amount: -1000
        }
    }

    const res = {
        status: jest.fn((x) => x),
        send: jest.fn((x) => x),
        json: jest.fn((x) => x)
    }

    await addFund(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json.mock.calls[0][0]).toEqual({ "message": "Please enter a valid amount or id" })
})

it('Return 404 for User not found', async () => {
    const id = "68e7aaa1ed8e576fb817b934"
    const req = {
        body: {
            id,
            amount: 400
        }
    }

    const res = {
        status: jest.fn((x) => x),
        send: jest.fn((x) => x),
        json: jest.fn((x) => x)
    }

    mockFindOne.mockImplementationOnce(() => {
        return null
    })

    await addFund(req, res);
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json.mock.calls[0][0]).toEqual({ "message": `User with id ${id} was not found!` })
})

it('Send 200 on success with valid response', async() => {
    const id = "68e7aaa1ed8e576fb817b934"
    const oldAmount = 500
    const amount = 400
    const req = {
        body: {
            id,
            amount
        }
    }

    const res = {
        status: jest.fn((x) => x),
        send: jest.fn((x) => x),
        json: jest.fn((x) => x)
    }

    mockFindOne.mockImplementationOnce(() => {
        return {
            _id: new ObjectId(id),
            name: "Keval",
            balance: oldAmount,
            createdOn: new Date()
        }
    })

    mockFindOneAndUpdate.mockImplementationOnce(() => {
        return {
            value: {
                _id: new ObjectId(id),
                name: "Keval",
                balance: oldAmount,
                createdOn: new Date()
            },
            ok : 1
        }
    })

    await addFund(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json.mock.calls[0][0].id).toEqual(new ObjectId(id))
    expect(res.json.mock.calls[0][0].balance).toBe(oldAmount + amount)
})



