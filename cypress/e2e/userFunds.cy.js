describe('Add funds to user account', () => {
    it("Add fund in user account and verify it", () => {
        // create user
        let user_name = "Preet"
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/users',
            headers: {
                'X-API-key': 'secret'
            },
            body: {
                "name": user_name
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.id).to.be.a('string')
            expect(response.body.id.length).to.eq(24)
            expect(response.body.name).to.eq(user_name)
            expect(response.body.balance).to.be.a('number')
            expect(response.body.balance).to.be.least(0)
            expect(response.body.createdOn).to.be.a('string')
            expect(response.body.createdOn.length).to.be.eq(22)

            const user_id = response.body.id
            const balance = parseInt(response.body.balance)
            let amount = 9;

            // add fund
            cy.request({
                method : 'POST',
                url : 'http://localhost:3000/fund',
                headers:{
                    'X-API-key' : 'secret'
                },
                body : {
                    "id" : user_id,
                    "amount" : amount
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.id).to.eq(user_id);
                const new_balance = balance + amount
                expect(response.body.balance).to.eq(new_balance);

                // check from balance route
                cy.request({
                    method : 'GET',
                    url : `/balance/${user_id}`,
                    headers : {
                        'X-API-key' : 'secret'
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.id).to.be.a('string')
                    expect(response.body.id).to.eq(user_id);
                    expect(response.body.balance).to.be.a('number')
                    expect(response.body.balance).to.eq(new_balance)
                })
            })
        })
    })
})