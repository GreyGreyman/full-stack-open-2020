// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', ({ username, password }) => {
  return cy.request('POST', '/api/login', { username, password })
    .then(response => {
      localStorage.setItem('loggedUser', JSON.stringify(response.body))
    })
})

Cypress.Commands.add('logout', () => {
  cy.window().its('localStorage')
    .invoke('removeItem', 'loggedUser')

  cy.visit('/')
})

Cypress.Commands.add('createBlog', (blog) => {
  cy.request({
    url: '/api/blogs',
    method: 'POST',
    body: blog,
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}`
    }
  })
})

Cypress.Commands.add('register', ({ username, password, name }) => {
  return cy.request('POST', '/api/users', { username, password, name })
})