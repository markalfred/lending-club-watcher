require('dotenv').load()
reqwest = require 'reqwest'
pusher = new (require 'pushbullet')(process.env.PUSHBULLET_KEY)
_ = require 'lodash'

SEEN = []

handleError = (err) ->
  console.log 'Error!', "#{err.statusText} -- #{err.responseText}"
  pusher.note process.env.PUSHBULLET_ACCOUNT, 'Error!', "#{err.statusText} -- #{err.responseText}"

loanSeen = (loan) -> _.contains SEEN, loan.id

pushLoan = (loan) ->
  SEEN.push loan.id
  url = "https://www.lendingclub.com/browse/loanDetail.action?loan_id=#{loan.id}"
  console.log 'Description Found!', url
  pusher.link process.env.PUSHBULLET_ACCOUNT, 'Description Found!', url


handleGoodLoans = ({loans}) ->
  _ loans
    .reject desc: null
    .reject loanSeen
    .each pushLoan
    .run()

makeRequest = ->
  console.log "#{new Date}: Checking..."
  reqwest
    url: 'https://api.lendingclub.com/api/investor/v1/loans/listing'
    method: 'get'
    type: 'json'
    headers: Authorization: process.env.LENDINGCLUB_KEY
    data: showAll: true
    success: handleGoodLoans,
    error: handleError

console.log 'Starting...'
setInterval makeRequest, 1000 * 60 * 10 unless process.argv.indexOf('--keep-alive') is -1
makeRequest()
