const srequest = require('sync-request')
const request = require('request')
const Cryptr = require('cryptr')
const shortid = require('shortid')

const server = 'http://192.168.0.14:1337'

function createUser(userName, shipId) {
  if (typeof userName !== 'string' && !(userName instanceof String)) {
    throw new Error('username should be a string')
  }

  var res = srequest('POST', `${server}/shipmates`, {
    json: {
      name: userName,
      shipId
    }
  })

  const msg = res.getBody('utf8')
  console.log(msg)
  return msg
}

function bonusPoints() {
  var res = srequest('POST', `${server}/packagescore`, {})

  const msg = res.getBody('utf8')
  console.log(msg)
  return msg
}

function callback(callback) {
  request({
    method: 'POST',
    url: `${server}/callback_1`,
  }, (err, response, body) => {
    callback(err, body)
  })
}

function encrypt(data, key, callback) {
  const cryptr = new Cryptr(key)

  setTimeout(() => {
    callback(null, cryptr.encrypt(data))
  }, 100)
}

function decrypt(data, key, callback) {
  const cryptr = new Cryptr(key)

  var res = srequest('POST', `${server}/decrypt_score`, {})

  setTimeout(() => {
    callback(null, cryptr.decrypt(data))
  }, 100)
}

function check(secret, callback) {
  request({
    method: 'POST',
    url: `${server}/check_secret`,
    json: true,
    body : { secret }
  }, (err, response, body) => {
    callback(err, body)
  })
}

let gold

function openChest() {
  return new Promise((resolve, reject) => {
    gold = shortid()

    resolve(gold)
  })
}

function isGold(treasure) {
  return new Promise((resolve, reject) => {
    if (treasure == gold) {
      request({
        method: 'POST',
        url: `${server}/treasure_gold`
      }, (err, response, body) => {
        if (err) return reject(err)

        resolve(body)
      })
    }
  })
}

function sendMessage(message, callback) {
  setTimeout(_ => {
    if (message == 'break') {
      callback(new Error('Invalid Message'))
    } else {
      callback(null, 'message sent!')
    }
  }, 100)
}

function checkPromise(fact) {
  let good

  return fact('test')
    .then(d => {
      if (d == 'message sent!') {
        good = true
      } else {
        throw new Error('Invalid data passed out')
      }
    })
    .then(_ => fact('break'))
    .catch(err => {
      if (err.message == 'Invalid Message') {
        if (good) {
          var res = srequest('POST', `${server}/making_promises`, {})
          return res.getBody('utf8')
        }
      } else {
        throw new Error('Invalid error handling')
      }
    })
}

function checkAll(answer) {
  request({
      method: 'POST',
      url: `${server}/map_check`,
      json: true,
      body: {
        answer
      }
    }, (err, response, body) => {
      if (err) return console.error(err)

      if (response.statusCode !== 200) {
        return console.error(`Bad status code ${response.statusCode} ${body || ''}`)
      }

      console.log(body)
    })
}

function checkMongo(treasure) {
  request({
      method: 'POST',
      url: `${server}/mongo_treasure`,
      json: true,
      body: {
        treasure
      }
    }, (err, response, body) => {
      if (err) return console.error(err)

      if (response.statusCode !== 200) {
        return console.error(`Bad status code ${response.statusCode} ${body || ''}`)
      }

      console.log(body)
    })
}

module.exports = {
  createUser: createUser,
  bonusPoints: bonusPoints,
  callback,
  encrypt,
  decrypt,
  check,
  openChest,
  isGold,
  sendMessage,
  checkPromise,
  checkAll,
  checkMongo
}
