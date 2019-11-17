const express = require('express')
const path = require('path')
const dealsService = require('./deals-service')
const { requireAuth } = require('../middleware/jwt-auth')

const dealsRouter = express.Router()
const jsonParser = express.json()

dealsRouter
  .route('/')
  .get((req, res, next) => {
    dealsService.getAllDeals(
      req.app.get('db')
    )
      .then(deals => {
        res.json(deals)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, url, phone_number, address, zip, description, happy_hour_days, happy_hour_start, happy_hour_end, reverse_happy_hour_start, reverse_happy_hour_end } = req.body
    const newDeal = { name, url, phone_number, address, zip, description, happy_hour_days, happy_hour_start, happy_hour_end }

    for (const [key, value] of Object.entries(newDeal)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }
    newDeal.reverse_happy_hour_end = reverse_happy_hour_end
    newDeal.reverse_happy_hour_start = reverse_happy_hour_start

    dealsService.insertDeal(
      req.app.get('db'),
      newDeal
    )
      .then(deal => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${deal.id}`))
          .json(deal)
      })
      .catch(next)
  })

dealsRouter
  .route('/:deal_id')
  .all((req, res, next) => {
    dealsService.getById(
      req.app.get('db'),
      req.params.deal_id
    )
      .then(deal => {
        if (!deal) {
          return res.status(404).json({
            error: { message: `Deal doesn't exist` }
          })
        }
        res.deal = deal
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(res.deal)
  })
  .delete((req, res, next) => {
    dealsService.deleteDeal(
      req.app.get('db'),
      req.params.deal_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, url, phone_number, address, zip, description, happy_hour_days, happy_hour_start, happy_hour_end, reverse_happy_hour_start, reverse_happy_hour_end } = req.body
    const dealToUpdate = { name, url, phone_number, address, zip, description, happy_hour_days, happy_hour_start, happy_hour_end, reverse_happy_hour_start, reverse_happy_hour_end }
    const numberOfValues = Object.values(dealToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: { message: `Request body must contain correct fields to update` }
      })
    }

    dealsService.updateDeal(
      req.app.get('db'),
      req.params.deal_id,
      dealToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  dealsRouter
    .route('/:deal_id/comments/')
    .all(requireAuth)
    .get((req, res, next) => {
      dealsService.getCommentsForDeal(
        req.app.get('db'),
        req.params.deal_id
      )
        .then(comments => {
          res.json(comments)
        })
        .catch(next)
    })

  module.exports = dealsRouter