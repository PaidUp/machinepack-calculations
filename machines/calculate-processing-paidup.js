'use strict'

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
    var di = inputs.discount / 100;
    var op = inputs.originalPrice * (1 - di);
    var div = inputs.originalPrice - op;

    var sp = inputs.stripePercent / 100;
    var sf = inputs.stripeFlat;
    var pu = inputs.paidUpFee / 100;

    var ow = ((op + sf) / (1 - sp - (sp * pu))) + (op * pu);

    // Return an object containing myLength and the secretCode
    return exits.success({
      owedPrice: Math.round(ow * 100) / 100,
      discount: Math.round(div * 100) / 100
    });

  }

};
