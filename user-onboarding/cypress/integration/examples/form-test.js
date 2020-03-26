describe('Test our inputs and submit our form', function (){
   beforeEach(function(){
    cy.visit('http://localhost:3000')  
   });

    it('add test to inputs and submit form', function (){
        cy.get('input[name="name"]')
            .type('devin')
            .should('have.value', 'devin');
        cy.get('input[name="email"]')
            .type('email@email.com')
            .should('have.value', 'email@email.com');
        cy.get('input[name="password"]')
            .type('password')
            .should('have.value','password');
        cy.get('[type="checkbox"]')
            .check()
            .should('have.checked');
        cy.get('button')
            .click();
    })
    it('check validation messages on invalid input', ()=>{
        cy.get('input[name="email"]')
            .type('not_an_email')
        cy.get('.error')
            .should('be.visible')
        cy.get('button')
            .should('be.disabled')
    })
})