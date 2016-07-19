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
      example: 'bank',
      description: 'Type of entity.',
      required: false
    },
    capAmount: {
      example: '456',
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

    console.log('log... ' , inputs.capAmount)

    var calculatePriceV2 = require('../api/v2/calculate-price');

    if (inputs.type && (inputs.type !== 'bank' && inputs.type !== 'card')) {
      return exits.error({ description: 'type must be `bank` or `card`' });
    }

    if (inputs.type === 'bank') {
      if (!inputs.capAmount || isNaN(parseFloat(inputs.capAmount))) {
        return exits.error({ description: 'capAmount is require and must be a number' });
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
