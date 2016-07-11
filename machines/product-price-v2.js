'use strict'

/**
 * User Pays
 * +===========+==============+===========+
 * |  Option   |  Processing  |  PaidUp   |
 * |===========|==============|===========|
 * |  Option 1 |     NO       |    YES    |
 * |-----------|--------------|-----------|
 * |  Option 2 |     NO       |     NO    |
 * |-----------|--------------|-----------|
 * |  Option 3 |     YES      |     YES   |
 * |-----------|--------------|-----------|
 * |  Option 4 |     YES      |     NO    |
 * +--------------------------------------+
 *
 */

module.exports = {

  friendlyName: 'product-price-v2',

  description: 'Calculate final price when user does not assume any fee.',

  extendedDescription: 'Calculate final price when user does not assume any fee.',

  inputs: {

    originalPrice : {
      example : 200.23,
      description : 'Price base for calculate owed price.',
      required : true
    },
    stripePercent : {
      example : 2.9,
      description : 'Percentage for calculate stripe fee.',
      required : true
    },
    stripeFlat : {
      example : 0.30,
      description : 'Amount base to calcualte stripe fee.',
      required : true
    },
    paidUpFee : {
      example : 5,
      description : 'Percentage to calculate Paid Up Fee.',
      required : true
    },
    discount : {
      example : 20,
      description : 'Percentage to discount at original price',
      required : true
    },
    payProcessing : {
      example : false,
      description : 'This parameter define if user pay stripe processing',
      required : true
    },
    payCollecting : {
      example : true,
      description : 'This parameter define if user pay PadUp processing',
      required : true
    }

  },

  defaultExit: 'success',

  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      example:  {
        version: 'v2',
        basePrice: 200,
        originalPrice: 300,
        totalFee: 12,
        owedPrice: 343.44,
        discount : 12,
        feePaidUp : 8.12,
        feeStripe : 3.23
      }
    }
  },

  fn: function (inputs, exits) {

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



    if(!processing && collect){

      basePrice = result.owedPrice / (1 + paidUpFeeInput);

    }else if(!processing && !collect){

      basePrice = result.owedPrice;

    }else if(processing && collect){

      basePrice = round((result.owedPrice * (1 - stripePercentInput - stripePercentInput * paidUpFeeInput)-stripeFlatInput) /
        (1 + paidUpFeeInput - paidUpFeeInput * stripePercentInput - paidUpFeeInput * paidUpFeeInput * stripePercentInput))

    }else if(processing && !collect){

      basePrice = round((result.owedPrice * (1 - stripePercentInput - stripePercentInput * paidUpFeeInput)-stripeFlatInput) /
        (paidUpFeeInput - paidUpFeeInput * stripePercentInput - paidUpFeeInput * paidUpFeeInput * stripePercentInput + 1 - paidUpFeeInput))

    }

    function round (num){
      return parseFloat((Math.round(num * 100000) / 100000).toFixed(2))
    }

    result.basePrice = basePrice;

    result.feePaidUp = round(basePrice * paidUpFeeInput)
    result.totalFee = round(result.feeStripe + result.feePaidUp);

    return exits.success(result);
  }

};
