import {jest} from '@jest/globals'
import { ObjectId } from 'mongodb';


const mockFindOne = jest.fn();

await jest.unstable_mockModule('../middleware/db.js', () => ({
    userCollection : { 
        findOne : mockFindOne
    }
}))

const { checkBalance } = await import('../routes/checkBalance.js').catch(err => console.log(err));

it('Should return 400 for invalid id', async() => {
    const req = {
        params : {
            uid : ""
        }
    }

    const res = {
        status : jest.fn((x) => x),
        send : jest.fn((x) => x),
        json : jest.fn((x) => x)
    }

    await checkBalance(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json.mock.calls[0][0]).toEqual({"msg" : "Bad request, Enter valid id"})
})

it('Return 404 for user not found', async() => {
    const id = "68e7aaa1ed8e576fb817b934"
    const req = {
        params : {
            uid : id
        }
    }

    const res = {
        status : jest.fn((x) => x),
        send : jest.fn((x) => x),
        json : jest.fn((x) => x)
    }

    mockFindOne.mockImplementationOnce(() => {
        return null  
    })

    await checkBalance(req, res);
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json.mock.calls[0][0]).toEqual({'msg' : `user with id ${id} was not found!`})
})


it('status 201 with response object', async() => {
    const id = "68e7aaa1ed8e576fb817b934"
    const user_balance = 0
    const req = {
        params : {
            uid : id
        }
    }

    const res = {
        status : jest.fn((x) => x),
        send : jest.fn((x) => x),
        json : jest.fn((x) => x)
    }

    mockFindOne.mockImplementationOnce(() => {
        return {
            _id : new ObjectId(id),
            name : "Keval",
            balance : user_balance,
            createdOn : new Date()
        }
    })

    await checkBalance(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json.mock.calls[0][0].id).toEqual(new ObjectId(id))
    expect(res.json.mock.calls[0][0].balance).toBe(user_balance)
})
