'use strict'

let assert = require('assert')

class Wallet extends Array {
  plus(money) {
    this.push(money)
    return this
  }
}

class Money {
  constructor(amount, currency) {
    this.amount = amount
    this.currency = currency
  }

  times(by) {
    return new this.constructor(this.amount * by, this.currency)
  }

  plus(money) {
    return new Wallet(this, money)
  }

  equal(other) {
    return this.currency === other.currency 
      && (this.amount === other.amount)
  }
}

class Bank {
  constructor() {
    this.rates = new Map()
  }

  reduce(wallet, currency) {
    return wallet.reduce((prev, cur) => {
      if (!prev) return prev
      else return new Money(prev.amount + this.convert(cur, currency).amount, currency)
    })
  }

  rate(from, to, value) {
    var key = from + ':' + to
    if (value) this.rates.set(key, value)
    return this.rates.get(key)
  }

  convert(money, toCurrency) {
    if (money.currency === toCurrency) return money
    var rate = this.rate(money.currency, toCurrency)
    assert(rate, `rate ${money.currency} to ${toCurrency} is missing`)
    return new Money(money.amount * rate, toCurrency)
  }
}

module.exports.usd = function usd(amount) {
  return new Money(amount, 'USD')
}

module.exports.sgd = function sgd(amount) {
  return new Money(amount, 'SGD')
}

module.exports.bank = function() {
  return new Bank()
}
