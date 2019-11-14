const bcrypt = require('bcrypt')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}

function makeAuthHeader(user) {
  const token = Buffer.from(`${user.user_name}:${user.password}`).toString('base64')
  return `Basic ${token}`
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('hhlv_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('hhlv_users_id_seq', ?)`,
        [users[users.length - 1].id],
      ))
}

function makeCommentsArray(users, deals) {
  return [
    {
      id: 1,
      text: 'First test comment!',
      deal_id: deals[0].id,
      user_id: users[0].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      text: 'Second test comment!',
      deal_id: deals[0].id,
      user_id: users[1].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      text: 'Third test comment!',
      deall_id: deals[0].id,
      user_id: users[2].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      text: 'Fourth test comment!',
      deall_id: deals[0].id,
      user_id: users[3].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 5,
      text: 'Fifth test comment!',
      deall_id: deals[deals.length - 1].id,
      user_id: users[0].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 6,
      text: 'Sixth test comment!',
      deall_id: deals[deals.length - 1].id,
      user_id: users[2].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 7,
      text: 'Seventh test comment!',
      deall_id: deals[3].id,
      user_id: users[0].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ];
}

function makeDealsArray() {
  return [
    {
      id: 1,
      name: `Giuseppes's Bar & Grille`,
      url: 'www.giuseppeslv.com',
      phone_number: '702-896-7916',
      address: '6065 S. Durango Rd.', 
      zip: '89113',
      description: `Giuseppe's Bar and Grille, a Las Vegas Italian Restaurant and Bar: When you are looking for a Las Vegas sports bar that is off of the strip, and a little less fast paced, look no further than Giuseppe''s Bar & Grille, a Las Vegas Italian restaurant and sports bar. Our location is open 24 hours a day with a full bar and kitchen to fulfill your needs.`,
      happy_hour_days: 'Everyday', 
      happy_hour_start: '4:00 PM', 
      happy_hour_end: '7:00 PM', 
      reverse_happy_hour_start: null, 
      reverse_happy_hour_end: null,
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 2,
      name: 'Cleaver Steakhouse',
      url: 'www.cleaverlasvegas.com',
      phone_number: '702-538-9888',
      address: '3900 Paradise Road', 
      zip: '89169',
      description: 'Butchered Meats, Seafood & Cocktails',
      happy_hour_days: 'Everyday', 
      happy_hour_start: '5:00 PM', 
      happy_hour_end: '8:00 PM', 
      reverse_happy_hour_start: '12:00 AM', 
      reverse_happy_hour_end: '3:00 AM',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 3,
      name: 'Herbs & Rye',
      url: 'www.herbsandrye.com',
      phone_number: '702-982-8036',
      address: '3713 W. Sahara Ave.', 
      zip: '89102',
      description: 'Top Rated Steakhouse and Cocktail Bar',
      happy_hour_days: 'Monday - Saturday', 
      happy_hour_start: '5:00 PM', 
      happy_hour_end: '8:00 PM', 
      reverse_happy_hour_start: '12:00 AM', 
      reverse_happy_hour_end: '3:00 AM',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 4,
      name: 'Brio Tuscan Grill',
      url: 'www.brioitalian.com',
      phone_number: '702-914-9145',
      address: '6653 Las Vegas Boulevard', 
      zip: '89119',
      description: 'BRIO Tuscan Grille Town Square brings the flavors of Tuscany to Las Vegas and Tivoli Village in Summerlin. Featuring wood-grilled and oven-roasted steaks, chops, seafood, house-made pasta specialties and flatbreads prepared in an authentic Italian wood-burning oven. Stunning architecture, white table cloths, casual atmosphere, full bar and outdoor dining. Enjoy lunch, dinner, weekend brunch and happy hour offered at the bar. Enjoy our great patio while enjoying a great cocktail. BRIO is the best Italian restaurant near you!',
      happy_hour_days: 'Monday - Friday', 
      happy_hour_start: '3:30 PM', 
      happy_hour_end: '6:30 PM', 
      reverse_happy_hour_start: null, 
      reverse_happy_hour_end: null,
      date_created: '2029-01-22T16:28:32.615Z'
    },
  ]
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        hhlv_users,
        hhlv_deals,
        hhlv_comments
      `
    )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE hhlv_deals_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE hhlv_users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('hhlv_users_id_seq', 0)`),
          trx.raw(`SELECT setval('hhlv_deals_id_seq', 0)`),
        ])
      )
  )
}

function seedDealsTables(db, users, deals, comments = []) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('hhlv_deals').insert(deals)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('hhlv_users_id_seq', ?)`,
        [users[users.length - 1].id],
    )
    // only insert comments if there are some, also update the sequence counter
    if (comments.length) {
      await trx.into('hhlv_comments').insert(comments)
      await trx.raw(
        `SELECT setval('hhlv_comments_id_seq', ?)`,
        [comments[comments.length - 1].id],
      )
    }
  })
}

module.exports = {
  makeDealsArray,
  makeUsersArray,
  seedUsers,
  cleanTables,
  makeCommentsArray,
  seedDealsTables,
  makeAuthHeader
}