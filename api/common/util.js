/**
 * Created by riclara on 7/18/16.
 */
'use strict'

function round (num){
  return parseFloat((Math.round(num * 100000) / 100000).toFixed(2))
}

module.exports = {
  round : round
}
