/**
 * Created by riclara on 7/18/16.
 */
'use strict'

var math = require('mathjs')

function round (num){
  //return parseFloat((Math.round(100 * num.toFixed(6)) / 100).toFixed(2))
  return math.round(num, 2)
}

module.exports = {
  round : round
}
