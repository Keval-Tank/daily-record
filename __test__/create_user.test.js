import {expect, jest} from '@jest/globals'

const mockedInsertOne = jest.fn();

await jest.unstable_mockModule('../middleware/db.js', () => ({
    userCollection : {
        insertOne : mockedInsertOne
    },
    now : new Date()
}));

const { createUser } = await import('../routes/createUser.js')

it('Return 400 for empty name field', async() => {
    const req = {
        body : {
          name : ""
        }
    }
    const res = {
        status : jest.fn((x) => x),
        send : jest.fn((x) => x),
        json : jest.fn((x) => x)
    }
    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
})

it('check for 201 with response', async() => {
    const req = {
        body : {
            name : "Keval"
        }
    }
    const res = {
        status : jest.fn((x) => x),
        send : jest.fn((x) => x),
        json : jest.fn((x) => x)
    }
    mockedInsertOne.mockImplementationOnce(() => {
        return {
            insertedId : "68e7aaa1ed8e576fb817b934"
        }
    })
    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send.mock.calls[0][0].id).toBe("68e7aaa1ed8e576fb817b934")
    expect(res.send.mock.calls[0][0].name).toBe("Keval")
    expect(res.send.mock.calls[0][0].balance).toBe(0)
    expect(res.send.mock.calls[0][0].createdOn.length).toBe(22)
})



