/**
 * Created by riclara on 7/18/16.
 */
'use strict'

function round (num){
  return parseFloat((Math.round(num * 100) / 100).toFixed(2))
}

module.exports = {
  round : round
}
