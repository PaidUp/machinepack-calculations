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

  friendlyName: 'calculate',

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
    }

    ,
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
        owedPrice: 343.44,
        discount : 12
      }
    }
  },

  fn: function (inputs, exits) {

    /**
     * Module Dependencies
     */

    // ...

    let di = inputs.discount / 100;
    let op = inputs.originalPrice * (1 - di);
    let div = inputs.originalPrice - op;
    let sp = inputs.stripePercent / 100;
    let sf = inputs.stripeFlat;
    let pu = inputs.paidUpFee / 100;

    let processing = inputs.payProcessing;
    let collect = inputs.payCollecting;

    let ow = 0;

    if(!processing && collect){

      ow = (op * (1 + pu));

    }else if(!processing && !collect){

      ow = op;

    }else if(processing && collect){

      ow = ((op + sf) / (1 - sp - (sp * pu))) + (op * pu);

    }else if(processing && !collect){

      ow = ((op - op * pu) + sf) / (1 - sp - sp * pu) + (op * pu);

    }

    // Return an object containing myLength and the secretCode
    return exits.success({
      owedPrice: Math.round(ow * 100) / 100,
      discount: Math.round(div * 100) / 100
    });

  }

};
