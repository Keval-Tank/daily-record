describe('For testing user route', () => {
  // it('This is an example', () => {
  //   cy.request('https://dog.ceo/api/breeds/image/random').should((response) => {
  //     expect(response.status).to.eq(200);
      
  //   })
  // })

  it("Create a new user", () => {
    let user_name = 'Keval'
    cy.request({
      method : 'POST',
      url : 'http://localhost:3000/api/users',
      headers : {
        'X-API-Key' : 'secret'
      },
      body:{
        'name' : user_name
      }
    }).should((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.id).to.be.a('string')
      expect(response.body.id.length).to.eq(24)
      expect(response.body.name).to.eq(user_name)
      expect(response.body.balance).to.be.a('number')
      expect(response.body.balance).to.be.least(0)
      expect(response.body.createdOn).to.be.a('string')
      expect(response.body.createdOn.length).to.be.eq(22)
    
    })
  })

})