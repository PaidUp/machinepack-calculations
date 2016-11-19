/**
 * Created by riclara on 7/18/16.
 */
'use strict'

var round = require('../common/util').round;

function card(inputs, exits) {

  try {
    let discountInput = inputs.discount / 100;
    let stripePercentInput = inputs.stripePercent / 100;
    let stripeFlatInput = inputs.stripeFlat;
    let paidUpFeeInput = inputs.paidUpFee / 100;
    let paidUpFlatInput = inputs.paidUpFlat;


    let processing = inputs.payProcessing;
    let collect = inputs.payCollecting;

    var newPrice = inputs.originalPrice;
    var basePrice = 0;

    var result = {
      version: 'v2',
      originalPrice: inputs.originalPrice,
      totalFee: 0,
      feePaidUp: 0,
      feeStripe: 0,//round((round(newPrice - round(newPrice * discountInput)) * stripePercentInput) + stripeFlatInput),
      owedPrice: round(newPrice - (newPrice * discountInput)),
      discount: round(newPrice * discountInput)
    }

    if (!processing && collect) {
      result.basePrice = round((result.owedPrice - paidUpFlatInput) / (1 + paidUpFeeInput));
    }
    else if (!processing && !collect) {
      result.basePrice = round(result.owedPrice);
    }
    else if (processing && collect) {
      result.basePrice = round((result.owedPrice - result.owedPrice * stripePercentInput - paidUpFlatInput - stripeFlatInput) / (1 + paidUpFeeInput));
    }
    else if (processing && !collect) {
      result.basePrice = round(result.owedPrice - result.owedPrice * stripePercentInput - stripeFlatInput);
    }

    //result.basePrice = round(basePrice);
    result.feeStripe = round(result.owedPrice * stripePercentInput + stripeFlatInput)
    result.feePaidUp = round(result.basePrice * paidUpFeeInput + paidUpFlatInput)
    result.totalFee = round(result.feeStripe + result.feePaidUp);
    console.log(result)
    return exits.success(result);
  } catch (e) {
    return exits.error({ description: e })
  }
}

function bank(inputs, exits) {

  try {
    let capAmount = inputs.capAmount;
    let newPrice = inputs.originalPrice;
    let discountInput = inputs.discount / 100;
    let owedPrice = round(newPrice - (newPrice * discountInput));
    let stripePercentInput = (inputs.stripePercent / 100);
    let stripeFlatInput = inputs.stripeFlat;
    let stripeAchPercentInput = (inputs.stripeAchPercent / 100);
    let stripeAchFlatInput = inputs.stripeAchFlat;
    let paidUpFeeInput = inputs.paidUpFee / 100;
    let processing = inputs.payProcessing;
    let collect = inputs.payCollecting;
    let paidUpFlatInput = inputs.paidUpFlat;


    var result = {
      version: 'v2',
      originalPrice: inputs.originalPrice,
      totalFee: 0,
      feePaidUp: 0,
      feeStripe: 0,
      owedPrice: owedPrice,
      discount: round(newPrice * discountInput)
    }

    if (!processing && collect) {
      result.basePrice = round((result.owedPrice - paidUpFlatInput) / (1 + paidUpFeeInput));
    }
    else if (!processing && !collect) {
      result.basePrice = round(result.owedPrice);
    }
    else if (processing && collect) {
      if(result.owedPrice <= (capAmount / stripeAchPercentInput)){
        result.basePrice = round((result.owedPrice - result.owedPrice * stripeAchPercentInput - paidUpFlatInput - stripeAchFlatInput) / (1 + paidUpFeeInput));        
      } else {
        result.basePrice = round((result.owedPrice - capAmount - paidUpFlatInput) / (1 + paidUpFeeInput));
      }
    }
    else if (processing && !collect) {
      if(result.owedPrice <= (capAmount / stripeAchPercentInput)){
        result.basePrice = round(result.owedPrice - result.owedPrice * stripeAchPercentInput - stripeAchFlatInput);        
      } else {
        result.basePrice = round(result.owedPrice - capAmount - stripeAchFlatInput);
      }
    }

    let tmpProcessing = round(result.owedPrice * stripeAchPercentInput + stripeAchFlatInput)
    result.feeStripe = tmpProcessing < capAmount ? tmpProcessing : capAmount;

    result.feePaidUp = round(result.basePrice * paidUpFeeInput + paidUpFlatInput)

    result.totalFee = round(result.feeStripe + result.feePaidUp);

    return exits.success(result);
  } catch (e) {
    return exits.error({ description: e })
  }
}

module.exports = {
  card: card,
  bank: bank
}
