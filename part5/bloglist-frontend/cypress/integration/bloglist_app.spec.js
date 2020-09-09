describe('Bloglist app', () => {
  beforeEach(() => {
    cy.request('POST', 'api/testing/reset')

    cy.register({
      name: 'Test Pestovich',
      username: 'test',
      password: 'pest'
    })
    cy.register({
      name: 'Rest Zestovich',
      username: 'rest',
      password: 'zest'
    })
    cy.visit('/')
  })

  it('Login form is shown', () => {
    cy.contains('Please log in')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input[name=username]').type('test')
      cy.get('input[name=password]').type('pest')
      cy.get('#log-in-button').click()

      cy.contains('Test Pestovich logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('input[name=username]').type('test')
      cy.get('input[name=password]').type('wrong')
      cy.get('#log-in-button').click()

      cy.get('.notification_error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Test Pestovich logged in')
    })
  })

  describe('when logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'test', password: 'pest' })
      cy.visit('/')
    })

    it('a blog can be created', () => {
      cy.contains('create new blog').click()

      cy.get('input[name=title]').type('test title')
      cy.get('input[name=author]').type('test author')
      cy.get('input[name=url]').type('test url')
      cy.get('button[data-testid=create-blog-button]').click()

      cy.get('.notification_success')
        .should('contain', 'a new blog "test title" by test author added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')

      cy.contains('test title test author')
    })

    describe('and several blogs exist', () => {
      beforeEach(() => {
        cy.createBlog({ title: 'test title', author: 'test author', url: 'test url', likes: 0 })
        cy.createBlog({ title: 'pest title', author: 'pest author', url: 'pest url', likes: 5 })
        cy.createBlog({ title: 'rest title', author: 'rest author', url: 'rest url', likes: 3 })
        cy.visit('/')

      })

      it('like can be added', () => {
        cy.contains('pest title').as('Blog')
        cy.get('@Blog').contains('show').click()
        cy.get('@Blog').contains('like').parent().find('button').click()
        cy.get('@Blog').contains('likes: 6')
      })

      it('blog can be deleted by creator', () => {
        cy.contains('pest title').as('Blog')
        cy.get('@Blog').contains('show').click()
        cy.get('@Blog').contains('delete').click()

        cy.get('.notification_success')
          .should('contain', 'Successufully deleted blog "pest title"')

        cy.should('not.contain', 'test title test author')
      })

      it('blog can not be deleted by not creator', () => {
        cy.logout()
        cy.login({ username: 'rest', password: 'zest' })
        cy.visit('/')
        cy.contains('pest title').as('Blog')
        cy.get('@Blog').should('not.contain', 'delete')
      })

      it('blogs ordered by likes in descending order', () => {
        cy.get('[data-testid=likes]').as('likes')
        cy.get('@likes').should((likes) => {
          for (let i = 1; i < likes.length; i++) {
            let last = parseInt(likes[i - 1].textContent.match(/\d+/)[0])
            let cur = parseInt(likes[i].textContent.match(/\d+/)[0])
            expect(cur).to.be.lessThan(last)
          }
        })
      })
    })
  })
})
