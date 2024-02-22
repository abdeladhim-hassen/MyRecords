describe('record', () => {
    it( 'should play the video', () => {
        cy.visit( '/' );
        cy.get('app-video-list > .gird a:first').click()
        cy.get('.video-js').click()
        cy.wait(3000)
        cy.get('.video-js').click()
        cy.get('.vjs-play-progress').invoke('width').should('gte', 0)
    })
})