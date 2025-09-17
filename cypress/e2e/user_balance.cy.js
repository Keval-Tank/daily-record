describe('for balance route', () => {
    it("get balance using userId", () => {
        // create user
        let user_name = "Kabir"
        cy.request({
            method: 'POST',
            url: '/users',
            headers: {
                'X-API-key': 'secret'
            },
            body: {
                'name': user_name
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.id).to.be.a('string')
            expect(response.body.id.length).to.eq(24)
            const user_id = response.body.id
            expect(response.body.name).to.eq(user_name)
            expect(response.body.balance).to.be.a('number')
            expect(response.body.balance).to.be.least(0)
            const balance = response.body.balance
            expect(response.body.createdOn).to.be.a('string')
            expect(response.body.createdOn.length).to.be.eq(22)
            
            cy.request({
                method : 'GET',
                url : `/balance/${user_id}`,
                headers:{
                    'X-API-key' : 'secret'
                }
            }).then((res) => {
                expect(res.status).to.eq(200)
                expect(res.body.id).to.eq(user_id)
                expect(res.body.balance).to.eq(balance)
            })

        })



    })
})