const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Comments Endpoints', function () {
  let db

  const testDeals = helpers.makeDealsArray()
  const testUsers = helpers.makeUsersArray()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe.only(`POST /api/comments`, () => {
    beforeEach('insert deals', () =>
      helpers.seedDealsTables(
        db,
        testUsers,
        testDeals,
      )
    )

    it(`responds 401 'Unauthorized request' when invalid password`, () => {
      const userInvalidPass = { user_name: testUsers[0].user_name, password: 'wrong' }
      return supertest(app)
        .post('/api/comments')
        .set('Authorization', helpers.makeAuthHeader(userInvalidPass))
        .expect(401, { error: `Unauthorized request` })
    })

    it(`creates an comment, responding with 201 and the new comment`, function () {
      this.retries(3)
      const testDeal = testDeals[0]
      const testUser = testUsers[0]
      const newComment = {
        text: 'Test new comment',
        deal_id: testDeal.id,
      }
      return supertest(app)
        .post('/api/comments')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newComment)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.text).to.eql(newComment.text)
          expect(res.body.deal_id).to.eql(newComment.deal_id)
          expect(res.body.user.id).to.eql(testUser.id)
          expect(res.headers.location).to.eql(`/api/comments/${res.body.id}`)
          const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
          const actualDate = new Date(res.body.date_created).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })
        .expect(res =>
          db
            .from('hhlv_comments')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.text).to.eql(newComment.text)
              expect(row.deal_id).to.eql(newComment.deal_id)
              expect(row.user_id).to.eql(testUser.id)
              const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
              const actualDate = new Date(row.date_created).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
        )
    })

    const requiredFields = ['text', 'deal_id']

    requiredFields.forEach(field => {
      const testDeal = testDeals[0]
      const testUser = testUsers[0]
      const newComment = {
        text: 'Test new comment',
        user_id: testUser.id,
        deal_id: testDeal.id,
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newComment[field]

        return supertest(app)
          .post('/api/comments')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newComment)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })
  })
})
