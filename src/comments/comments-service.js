const xss = require('xss')

const CommentsService = {
  getById(db, id) {
    return db
      .from('hhlv_comments AS comm')
      .select(
        'comm.id',
        'comm.text',
        'comm.date_created',
        'comm.deal_id',
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.user_name,
                  usr.date_created
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .leftJoin(
        'hhlv_users AS usr',
        'comm.user_id',
        'usr.id',
      )
      .where('comm.id', id)
      .first()
  },

  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into('hhlv_comments')
      .returning('*')
      .then(([comment]) => comment)
      .then(comment =>
        CommentsService.getById(db, comment.id)
      )
  },

  serializeComment(comment) {
    const { user } = comment
    return {
      id: comment.id,
      text: xss(comment.text),
      deal_id: comment.deal_id,
      date_created: new Date(comment.date_created),
      user: {
        id: user.id,
        user_name: user.user_name,
        date_created: new Date(user.date_created)
      },
    }
  }
}

module.exports = CommentsService
