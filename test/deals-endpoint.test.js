const knex = require('knex')
const app = require('../src/app')
const { makeDealsArray } = require('./test-helpers')


describe('Deals endpoints', function () {
    let db
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })


    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE hhlv_deals RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE hhlv_deals RESTART IDENTITY CASCADE'))


    describe(`GET /api/deals`, () => {

        context(`Given no deals`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/deals')
                    .expect(200, [])
            })
        })

        context(`Given there are deals in the database`, () => {
            const testDeals = makeDealsArray()
            beforeEach('insert deals', () => {
                return db
                .into('hhlv_deals')
                .insert(testDeals.map(deal => ({
                    id: deal.id,
                    name: deal.name,
                    url: deal.url,
                    phone_number: deal.phone_number,
                    address: deal.address,
                    zip: deal.zip,
                    description: deal.description,
                    happy_hour_days: deal.happy_hour_days,
                    happy_hour_start: deal.happy_hour_start,
                    happy_hour_end: deal.happy_hour_end,
                    reverse_happy_hour_start: deal.reverse_happy_hour_start,
                    reverse_happy_hour_end: deal.reverse_happy_hour_end,
                    date_created: new Date(deal.date_created)
                })))
            })

            it('responds with 200 and all of the deals', () => {
                return supertest(app)
                    .get('/api/deals')
                    .expect(200, testDeals)
            })
        })
    })

    describe(`Get /api/deals/:deal_id`, () => {
        context(`Given no deals`, () => {
            const dealId = 123456
            return supertest(app)
                .get(`/api/deals/${dealId}`)
                .expect(404, { error: { message: `Deal doesn't exist` } })
        })
    })

    context('Given there are deals in the database', () => {
        const testDeals = makeDealsArray()

        beforeEach('insert deals', () => {
            return db
                .into('hhlv_deals')
                .insert(testDeals.map(deal => ({
                    id: deal.id,
                    name: deal.name,
                    url: deal.url,
                    phone_number: deal.phone_number,
                    address: deal.address,
                    zip: deal.zip,
                    description: deal.description,
                    happy_hour_days: deal.happy_hour_days,
                    happy_hour_start: deal.happy_hour_start,
                    happy_hour_end: deal.happy_hour_end,
                    reverse_happy_hour_start: deal.reverse_happy_hour_start,
                    reverse_happy_hour_end: deal.reverse_happy_hour_end,
                    date_created: new Date(deal.date_created)
                })))
        })
        it('responds with 200 and the specified deal', () => {
            const dealId = 2
            const expectedDeal = testDeals[dealId - 1]
            return supertest(app)
                .get(`/api/deals/${dealId}`)
                .expect(200, expectedDeal)
        })
    })



    describe(`POST /api/deals`, () => {

        it(`creates a new deal, responding with 201 and the new deal`, function () {
            this.retries(3)
            const newDeal = {
                name: `PTs Pub`,
                url: 'www.pteglv.com',
                phone_number: '702-796-7775',
                address: '2300 E. Desert Inn Rd.',
                zip: '89169',
                description: `Outpost of a local chain offering lots of beer, pub grub, TV sports, happy hours & video gaming.`,
                happy_hour_days: 'Everyday',
                happy_hour_start: '5:00 PM',
                happy_hour_end: '7:00 PM',
                reverse_happy_hour_start: '12:00 AM',
                reverse_happy_hour_end: '2:00 AM'
            }
            return supertest(app)
                .post('/api/deals')
                .send(newDeal)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.name).to.eql(newDeal.name)
                    expect(res.body.url).to.eql(newDeal.url)
                    expect(res.body.phone_number).to.eql(newDeal.phone_number)
                    expect(res.body.address).to.eql(newDeal.address)
                    expect(res.body.zip).to.eql(newDeal.zip)
                    expect(res.body.description).to.eql(newDeal.description)
                    expect(res.body.happy_hour_days).to.eql(newDeal.happy_hour_days)
                    expect(res.body.happy_hour_start).to.eql(newDeal.happy_hour_start)
                    expect(res.body.happy_hour_end).to.eql(newDeal.happy_hour_end)
                    expect(res.body.reverse_happy_hour_start).to.eql(newDeal.reverse_happy_hour_start)
                    expect(res.body.reverse_happy_hour_end).to.eql(newDeal.reverse_happy_hour_end)
                    expect(res.headers.location).to.eql(`/api/deals/${res.body.id}`)
                })
                .then(postRes =>
                    supertest(app)
                        .get(`/api/deals/${postRes.body.id}`)
                        .expect(postRes.body)
                )
        })

        const requiredFields = ['name', 'url', 'phone_number', 'address', 'zip', 'description', 'happy_hour_days', 'happy_hour_start', 'happy_hour_end']

        requiredFields.forEach(field => {
            const newDeal = {
                name: `PTs Pub`,
                url: 'www.pteglv.com',
                phone_number: '702-796-7775',
                address: '2300 E. Desert Inn Rd.',
                zip: '89169',
                description: `Outpost of a local chain offering lots of beer, pub grub, TV sports, happy hours & video gaming.`,
                happy_hour_days: 'Everyday',
                happy_hour_start: '5:00 PM',
                happy_hour_end: '7:00 PM',
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newDeal[field]

                return supertest(app)
                    .post('/api/deals')
                    .send(newDeal)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        })
    })

    describe(`DELETE /api/deals/:deal_id`, () => {
        context('Given there are deals in the database', () => {
            const testDeals = makeDealsArray()

            beforeEach('insert deals', () => {
                return db
                .into('hhlv_deals')
                .insert(testDeals.map(deal => ({
                    id: deal.id,
                    name: deal.name,
                    url: deal.url,
                    phone_number: deal.phone_number,
                    address: deal.address,
                    zip: deal.zip,
                    description: deal.description,
                    happy_hour_days: deal.happy_hour_days,
                    happy_hour_start: deal.happy_hour_start,
                    happy_hour_end: deal.happy_hour_end,
                    reverse_happy_hour_start: deal.reverse_happy_hour_start,
                    reverse_happy_hour_end: deal.reverse_happy_hour_end,
                    date_created: new Date(deal.date_created)
                })))
            })

            it('responds with 204 and removes the deal', () => {
                const idToRemove = 2
                const expectedDeals = testDeals.filter(deal => deal.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/deals/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/deals`)
                            .expect(expectedDeals))
            })
        })

        context(`Given no deals`, () => {
            it('responds with 404', () => {
                const dealId = 123456
                supertest(app)
                    .delete(`/api/deals/${dealId}`)
                    .expect(204, { error: { message: `Deal doesn't exist` } })
            })
        })
    })

    describe(`PATCH /api/deals/:deal_id`, () => {
        context(`Given no deals`, () => {
            it(`responds with 404`, () => {
                const dealId = 123456
                return supertest(app)
                    .patch(`/api/deals/${dealId}`)
                    .expect(404, { error: { message: `Deal doesn't exist` } })
            })
        })

        context(`Given there are deals in the database`, () => {
            const testDeals = makeDealsArray()

            beforeEach('insert deals', () => {
                return db
                .into('hhlv_deals')
                .insert(testDeals.map(deal => ({
                    id: deal.id,
                    name: deal.name,
                    url: deal.url,
                    phone_number: deal.phone_number,
                    address: deal.address,
                    zip: deal.zip,
                    description: deal.description,
                    happy_hour_days: deal.happy_hour_days,
                    happy_hour_start: deal.happy_hour_start,
                    happy_hour_end: deal.happy_hour_end,
                    reverse_happy_hour_start: deal.reverse_happy_hour_start,
                    reverse_happy_hour_end: deal.reverse_happy_hour_end,
                    date_created: new Date(deal.date_created)
                })))
            })

            it(`responds with 204 and updates the deal`, () => {
                const idToUpdate = 2
                const updateDeal = {
                    name: `updated name`,
                    url: 'updated url',
                    phone_number: '000-000-0000',
                    address: 'updated address',
                    zip: '00000',
                    description: `updated description`,
                    happy_hour_days: 'updated happy hour days',
                    happy_hour_start: '12:00 AM',
                    happy_hour_end: '12:00 PM',
                }

                const expectedDeal = {
                    ...testDeals[idToUpdate - 1],
                    ...updateDeal
                }
                return supertest(app)
                    .patch(`/api/deals/${idToUpdate}`)
                    .send(updateDeal)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/deals/${idToUpdate}`)
                            .expect(expectedDeal))
            })

            it(`responds with 400 when no required fields are suppleid`, () => {
                const idToUpdate = 2
                return supertest(app)
                    .patch(`/api/deals/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain correct fields to update`
                        }
                    })
            })
            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2
                const updateDeal = {
                    name: 'updated name',
                }
                const expectedDeal = {
                    ...testDeals[idToUpdate - 1],
                    ...updateDeal
                }

                return supertest(app)
                    .patch(`/api/deals/${idToUpdate}`)
                    .send({
                        ...updateDeal,
                        fieldToIgnore: 'should not be in GET response',
                    })
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/deals/${idToUpdate}`)
                            .expect(expectedDeal))
            })
        })
    })
})
