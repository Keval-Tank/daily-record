describe('For testing transaction', () => {
    it('Create Users and make a proper transaction between them', () => {
        // create users 1
        let user1 = "Keval"
        let user2 = "Karan"
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/users',
            headers: {
                'X-API-key': 'secret'
            },
            body: {
                "name": user1
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.id).to.be.a('string')
            expect(response.body.id.length).to.eq(24)
            const user_1_id = response.body.id;
            expect(response.body.name).to.eq(user1)
            expect(response.body.balance).to.be.a('number')
            expect(response.body.balance).to.be.least(0)
            const user_1_balance = response.body.balance;
            expect(response.body.createdOn).to.be.a('string')
            expect(response.body.createdOn.length).to.be.eq(22)

            //create user 2
            cy.request({
                method: 'POST',
                url: 'http://localhost:3000/api/users',
                headers: {
                    'X-API-key': 'secret'
                },
                body: {
                    "name": user2
                }
            }).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.id).to.be.a('string')
                expect(response.body.id.length).to.eq(24)
                const user_2_id = response.body.id
                expect(response.body.name).to.eq(user2)
                expect(response.body.balance).to.be.a('number')
                expect(response.body.balance).to.be.least(0)
                const user_2_balance = response.body.balance
                expect(response.body.createdOn).to.be.a('string')
                expect(response.body.createdOn.length).to.be.eq(22)


                // add funds to user1 and user2
                // add funds in user1
                let amount1 = 1000
                let amount2 = 5000
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:3000/api/fund',
                    headers: {
                        'X-API-key': 'secret'
                    },
                    body: {
                        "id": user_1_id,
                        "amount": amount1
                    }
                }).then((response) => {
                    const new_1_balance = user_1_balance + amount1
                    expect(response.status).to.eq(200)
                    expect(response.body.id).to.eq(user_1_id)
                    expect(response.body.balance).to.eq(new_1_balance)


                    // check balance after adding funds and before transaction
                    // for user1
                    cy.request({
                        method: 'GET',
                        url: `http://localhost:3000/api/balance/${user_1_id}`,
                        headers: {
                            'X-API-key': 'secret'
                        }
                    }).then((response) => {
                        expect(response.status).to.eq(200)
                        expect(response.body.id).to.eq(user_1_id)
                        expect(response.body.balance).to.eq(new_1_balance)

                        // add funds in user 2
                        cy.request({
                            method: 'POST',
                            url: 'http://localhost:3000/api/fund',
                            headers: {
                                'X-API-key': 'secret'
                            },
                            body: {
                                "id": user_2_id,
                                "amount": amount2
                            }
                        }).then((response) => {
                            const new_2_balance = user_2_balance + amount2
                            expect(response.status).to.eq(200)
                            expect(response.body.id).to.eq(user_2_id)
                            expect(response.body.balance).to.eq(new_2_balance)

                            // check balance after adding funds and before transaction
                            // for user2
                            cy.request({
                                method: 'GET',
                                url: `http://localhost:3000/api/balance/${user_2_id}`,
                                headers: {
                                    'X-API-key': 'secret'
                                }
                            }).then((response) => {
                                expect(response.status).to.eq(200)
                                expect(response.body.id).to.eq(user_2_id)
                                expect(response.body.balance).to.eq(new_2_balance)

                                // transaction between 1 and 2
                                let transfer_amount = 35;
                                let sender = { id: user_2_id, balance: new_2_balance }
                                let reciever = { id: user_1_id, balance: new_1_balance }
                                cy.request({
                                    method: 'POST',
                                    url: 'http://localhost:3000/api/transfer',
                                    headers: {
                                        'X-API-key': 'secret'
                                    },
                                    body: {
                                        "from": sender.id,
                                        "to": reciever.id,
                                        "amount": transfer_amount
                                    }
                                }).then((response) => {
                                    expect(response.status).to.eq(200)
                                    expect(response.body.status).to.be.oneOf(["Pending", "Cancelled", "Done"])
                                    expect(response.body.sender).to.be.oneOf([user_1_id, user_2_id])
                                    expect(response.body.reciever).to.be.oneOf([user_1_id, user_2_id])
                                    expect(response.body.amount).to.eq(transfer_amount)
                                    expect(response.body.creationTime.length).to.eq(22)



                                    // check user balance after transaction
                                    // for sender
                                    let credit = sender.balance - transfer_amount
                                    cy.request({
                                        method: 'GET',
                                        url: `http://localhost:3000/api/balance/${sender.id}`,
                                        headers: {
                                            'X-API-key': 'secret'
                                        }
                                    }).then((res) => {
                                        expect(res.status).to.eq(200)
                                        expect(res.body.id).to.eq(sender.id)
                                        expect(res.body.balance).to.eq(credit)
                                    })

                                    // for reciever
                                    let debit = reciever.balance + transfer_amount
                                    cy.request({
                                        method: 'GET',
                                        url: `http://localhost:3000/api/balance/${reciever.id}`,
                                        headers: {
                                            'X-API-key': 'secret'
                                        }
                                    }).then((res) => {
                                        expect(res.status).to.eq(200)
                                        expect(res.body.id).to.eq(reciever.id)
                                        expect(res.body.balance).to.eq(debit)
                                    })

                                })
                            })
                        })
                    })
                })
            })
        })
    })
})