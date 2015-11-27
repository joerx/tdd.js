'use strict'

let assert = require('assert')

// this doesn't look as smart as it used to be. think about something better...
function wallet() {
  let wallet = Array.prototype.slice.call(arguments)

  wallet.plus = function(money) {
    wallet.push(money)
    return wallet
  }

  return wallet 
}

function bank() {
  let rates = new Map()

  let self = {
    reduce: function(wallet, currency) {
      return wallet.reduce((prev, cur) => {
        if (!prev) return prev
        else return money(prev.amount + self.convert(cur, currency).amount, currency)
      })
    },

    rate: function(from, to, value) {
      var key = from + ':' + to
      if (value) rates.set(key, value)
      return rates.get(key)
    },

    convert: function(someMoney, toCurrency) {
      if (someMoney.currency === toCurrency) return someMoney
      var rate = self.rate(someMoney.currency, toCurrency)
      assert(rate, `rate ${someMoney.currency} to ${toCurrency} is missing`)
      return money(someMoney.amount * rate, toCurrency)
    }
  }

  return self
}

function money(amount, currency) {
  let self = {
    times: function (by) {
      return money(amount * by, currency)
    },

    plus: function(money) {
      return wallet(self, money)
    },

    equal: function(other) {
      return currency === other.currency 
        && (amount === other.amount)
    },

    get amount() {
      return amount
    },

    get currency() {
      return currency
    }
  }

  return self
}

module.exports.usd = function usd(amount) {
  return money(amount, 'USD')
}

module.exports.sgd = function sgd(amount) {
  return money(amount, 'SGD')
}

module.exports.bank = bank
