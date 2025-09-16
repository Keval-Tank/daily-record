describe('For testing user route', () => {
  // it('This is an example', () => {
  //   cy.request('https://dog.ceo/api/breeds/image/random').should((response) => {
  //     expect(response.status).to.eq(200);
      
  //   })
  // })

  it("Return balance of a user", () => {
    cy.request({
      method : 'GET',
      url : '/balance/68c936fa36fc7585ba1de2e3',
      headers : {
        'X-API-Key' : 'secret'
      }
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq('68c936fa36fc7585ba1de2e3');
      expect(response.body.balance).to.be.a('number')
    })
  })

})