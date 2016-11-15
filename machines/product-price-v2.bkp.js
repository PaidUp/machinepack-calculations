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
    type: {
      example: 'bank_account',
      description: 'Type of entity.',
      required: false
    },
    capAmount: {
      example: 5,
      description: 'Amount limit for choose a kind of calculation.',
      required: false
    },
    originalPrice: {
      example: 200.23,
      description: 'Price base for calculate owed price.',
      required: true
    },
    stripePercent: {
      example: 2.9,
      description: 'Percentage for calculate stripe fee.',
      required: true
    },
    stripeFlat: {
      example: 0.30,
      description: 'Amount base to calcualte stripe fee.',
      required: true
    },
    stripeAchPercent: {
      example: 2.9,
      description: 'Percentage for calculate stripe fee.',
      required: false
    },
    stripeAchFlat: {
      example: 0.30,
      description: 'Amount base to calcualte stripe fee.',
      required: false
    },
    paidUpFee: {
      example: 5,
      description: 'Percentage to calculate Paid Up Fee.',
      required: true
    },
    discount: {
      example: 20,
      description: 'Percentage to discount at original price',
      required: true
    },
    payProcessing: {
      example: false,
      description: 'This parameter define if user pay stripe processing',
      required: true
    },
    payCollecting: {
      example: true,
      description: 'This parameter define if user pay PadUp processing',
      required: true
    }

  },

  defaultExit: 'success',

  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      example: {
        version: 'v2',
        basePrice: 200,
        originalPrice: 300,
        totalFee: 12,
        owedPrice: 343.44,
        discount: 12,
        feePaidUp: 8.12,
        feeStripe: 3.23
      }
    }
  },

  fn: function (inputs, exits) {

    var calculatePriceV2 = require('../api/v2/calculate-price');

    if (inputs.type && (inputs.type !== 'bank_account' && inputs.type !== 'card')) {
      return exits.error({ description: 'type must be `bank_account` or `card`' });
    }

    if (inputs.type === 'bank_account') {
      if (isNaN(parseFloat(inputs.capAmount))) {
        return exits.error({ description: 'capAmount is require and must be a number' });
      }
      if (isNaN(parseFloat(inputs.stripeAchPercent)) ){
        return exits.error({ description: 'stripeAchPercent is require and must be a number' });
      }
      if (isNaN(parseFloat(inputs.stripeAchFlat))) {
        return exits.error({ description: 'stripeAchFlat is require and must be a number' });
      }
      
      else {
        return calculatePriceV2.bank(inputs, exits);
      }
    }
    else {
      return calculatePriceV2.card(inputs, exits);
    }
  }

};