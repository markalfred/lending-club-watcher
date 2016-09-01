'use strict'

require('dotenv').load()
const reqwest = require('reqwest')
const Pushbullet = require('pushbullet')
const _ = require('lodash')

const LENDINGCLUB_KEY = process.env.LENDINGCLUB_KEY
const PUSHBULLET_KEY = process.env.PUSHBULLET_KEY
const PUSHBULLET_ACCOUNT = process.env.PUSHBULLET_ACCOUNT
const pusher = new Pushbullet(PUSHBULLET_KEY)

const seen = []

function handleError(err) {
  console.log('Error!', err.statusText + ' -- ' + err.responseText)
  return pusher.note(PUSHBULLET_ACCOUNT, 'Error!', err.statusText + ' -- ' + err.responseText)
}

function loanSeen(loan) {
  return _.contains(seen, loan.id)
}

function pushLoan(loan) {
  var url
  seen.push(loan.id)
  url = 'https://www.lendingclub.com/browse/loanDetail.action?loan_id=' + loan.id
  console.log('Description Found!', url)
  return pusher.link(PUSHBULLET_ACCOUNT, 'Description Found!', url)
}

function handleGoodLoans(arg) {
  var loans
  loans = arg.loans
  return _(loans).reject({
    desc: null
  }).reject(loanSeen).each(pushLoan).run()
}

function makeRequest() {
  console.log((new Date) + ': Checking...')
  return reqwest({
    url: 'https://api.lendingclub.com/api/investor/v1/loans/listing',
    method: 'get',
    type: 'json',
    headers: {
      Authorization: LENDINGCLUB_KEY
    },
    data: {
      showAll: true
    },
    success: handleGoodLoans,
    error: handleError
  })
}

if (process.argv.indexOf('--keep-alive') !== -1) {
  console.log('Starting...')
  setInterval(makeRequest, 1000 * 60 * 10)
  makeRequest()
}

exports.handler = makeRequest
