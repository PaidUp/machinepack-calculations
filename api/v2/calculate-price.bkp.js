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


    let processing = inputs.payProcessing;
    let collect = inputs.payCollecting;

    var newPrice = inputs.originalPrice;
    var basePrice = 0;

    var result = {
      version: 'v2',
      originalPrice: inputs.originalPrice,
      totalFee: 0,
      feePaidUp: 0,
      feeStripe: round((round(newPrice - round(newPrice * discountInput)) * stripePercentInput) + stripeFlatInput),
      owedPrice: round(newPrice - (newPrice * discountInput)),
      discount: round(newPrice * discountInput)
    }

    if (!processing && collect) {
      basePrice = result.owedPrice / (1 + paidUpFeeInput)
    }
    else if (!processing && !collect) {
      basePrice = result.owedPrice;
    }
    else if (processing && collect) {
      basePrice = (result.owedPrice * (1 - stripePercentInput - stripePercentInput * paidUpFeeInput) - stripeFlatInput) /
        (1 + paidUpFeeInput - paidUpFeeInput * stripePercentInput - paidUpFeeInput * paidUpFeeInput * stripePercentInput)
    }
    else if (processing && !collect) {
      basePrice = (result.owedPrice * (1 - stripePercentInput - stripePercentInput * paidUpFeeInput) - stripeFlatInput) /
        (paidUpFeeInput - paidUpFeeInput * stripePercentInput - paidUpFeeInput * paidUpFeeInput * stripePercentInput + 1 - paidUpFeeInput)
    }

    result.basePrice = round(basePrice);

    result.feePaidUp = round(basePrice * paidUpFeeInput)
    result.totalFee = round(result.feeStripe + result.feePaidUp);

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

    let basePrice = 0;


    let tmpProcessing = round((round(newPrice - round(newPrice * discountInput)) * stripeAchPercentInput) + stripeAchFlatInput)
    let feeStripe = tmpProcessing < capAmount ? tmpProcessing : capAmount;

    var result = {
      version: 'v2',
      originalPrice: inputs.originalPrice,
      totalFee: 0,
      feePaidUp: 0,
      feeStripe: feeStripe,
      owedPrice: owedPrice,
      discount: round(newPrice * discountInput)
    }

    if (!processing && collect) {
      basePrice = result.owedPrice / (1 + paidUpFeeInput)
    }
    else if (!processing && !collect) {
      basePrice = result.owedPrice;
    }
    else if (processing && collect) {
      let numerator = (result.owedPrice * (1 - stripePercentInput - stripePercentInput * paidUpFeeInput) - stripeFlatInput);
      let denominator = (1 + paidUpFeeInput - paidUpFeeInput * stripePercentInput - paidUpFeeInput * paidUpFeeInput * stripePercentInput);

      basePrice = (result.owedPrice * (1 - stripePercentInput - stripePercentInput * paidUpFeeInput) - stripeFlatInput) /
        (1 + paidUpFeeInput - paidUpFeeInput * stripePercentInput - paidUpFeeInput * paidUpFeeInput * stripePercentInput);
    }
    else if (processing && !collect) {
      basePrice = (result.owedPrice * (1 - stripePercentInput - stripePercentInput * paidUpFeeInput) - stripeFlatInput) /
        (paidUpFeeInput - paidUpFeeInput * stripePercentInput - paidUpFeeInput * paidUpFeeInput * stripePercentInput + 1 - paidUpFeeInput)
    }

    result.basePrice = round(basePrice);

    result.feePaidUp = round(basePrice * paidUpFeeInput)

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
