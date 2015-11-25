'use strict'

let expect = require('chai').expect
let money = require('./money')

describe('Money', () => {

  describe('currency', () => {
    it('should be USD for US Dollars', () => {
      let seven = money.usd(7)
      expect(seven.currency).to.equal('USD')
    })

    it('should be SGD for Sing Dollars', () => {
      let seven = money.sgd(7)
      expect(seven.currency).to.equal('SGD')
    })
  })

  describe('multiplication', () => {
    it('should return 14 for 7 USD x 2', () => {
      let seven = money.usd(7)
      expect(seven.times(2).equal(money.usd(14))).to.be.true
    })

    it('should return 14 for 7 SGD x 2', () => {
      let seven = money.sgd(7)
      expect(seven.times(2).equal(money.sgd(14))).to.be.true
    })

    it('should return the same currency', () => {
      let other = money.sgd(7).times(2)
      expect(other.currency).to.equal('SGD')
    })

    it('should not have side effects', () => {
      let five = money.usd(5)
      expect(five.times(2).equal(money.usd(10))).to.be.true
      expect(five.times(3).equal(money.usd(15))).to.be.true
    })
  })

  describe('addition', () => {
    it('should return an array with two elements', () => {
      let wallet = money.usd(1).plus(money.usd(1))
      expect(wallet.length).to.equal(2)
    })

    it('should be chainable', () => {
      let wallet = money.usd(1).plus(money.usd(1)).plus(money.usd(1))
      expect(wallet.length).to.equal(3)
    })
  })

  describe('equal', () => {
    it('should be true if amounts are the same', () => {
      let five = money.usd(5)
      let other = money.usd(5)
      expect(five.equal(other)).to.be.true
    })

    it('should not be true of amounts are not the same', () => {
      let five = money.usd(5)
      let six = money.usd(6)
      expect(five.equal(six)).not.to.be.true
    })

    it('should not be true of currencies are not the same', () => {
      let fiveUSD = money.usd(5)
      let fiveSGD = money.sgd(5)
      expect(fiveUSD.equal(fiveSGD)).not.to.be.true
    })

    it('should not be true if the other thing is not money', () => {
      let fiveUSD = money.sgd(5)
      let other = {amount: 5}
      expect(fiveUSD.equal(other)).not.to.be.true
    })
  })
})

describe('Bank', () => {
  describe('rate', () => {
    it('should add a rate if called with 3 args', () => {
      let bank = money.bank()
      bank.rate('SGD', 'USD', 0.7)
      expect(bank.rate('SGD', 'USD')).to.equal(0.7)
    })
  })

  describe('reduce', () => {
    it('should reduce an array of currencies', () => {
      let wallet = [money.usd(1), money.usd(1)]
      let result = money.bank().reduce(wallet, 'USD')
      expect(result.amount).to.equal(2)
    })

    it('should reduce 7 USD + 10 SGD to 14 USD', () => {
      let bank = money.bank()
      bank.rate('SGD', 'USD', 0.7)
      let wallet = money.usd(7).plus(money.sgd(10))
      let result = bank.reduce(wallet, 'USD')
      expect(result.equal(money.usd(14))).to.be.true
    })
  })

  describe('convert', () => {
    it('should convert 10 SGD to 7 USD', () => {
      let bank = money.bank()
      bank.rate('SGD', 'USD', 0.7)
      let result = bank.convert(money.sgd(10), 'USD')
      expect(result.equal(money.usd(7))).to.be.true
    })

    it('should throw an error if rate is missing', () => {
      let bank = money.bank()
      expect(() => bank.convert(money.sgd(10), 'USD')).to.throw('rate SGD to USD is missing')
    })
  })
})
