const xss = require('xss') 

const DealsService = {
  getAllDeals(knex) {
    return knex.select('*').from('hhlv_deals')
  },
  insertDeal(knex, newDeal) {
    return knex
      .insert(newDeal)
      .into('hhlv_deals')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex
      .from('hhlv_deals')
      .select('*')
      .where('id', id)
      .first()
  },
  deleteDeal(knex, id) {
    return knex('hhlv_deals')
      .where({ id })
      .delete()
  },
  updateDeal(knex, id, newDealFields) {
    return knex('hhlv_deals')
      .where({ id })
      .update(newDealFields)
  },
  getCommentsForDeal(knex, db, deal_id) {
    return knex
      .from('hhlv_comments')
      .select('*')
      .where('deal_id', deal_id)
  },
  serializeDealComment(comment) {
    const { user } = comment
    return {
      id: comment.id,
      deal_id: comment.deal_id,
      text: xss(comment.text),
      user: {
        id: user.id,
        user_name: user.user_name
      }
    }
  }
}

module.exports = DealsService