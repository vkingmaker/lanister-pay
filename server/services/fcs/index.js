const Response = require("../../../utils/constants/Response"),
			RedisClient = require("../../../lib/redis");

/**
 * Handles every business logic that concerns Fee configuration spec
 */
module.exports = class FcsService {
  /**
   * Creats the parsed FeeConfigurationSpec
   * @property {Function} create  parse and save FeeConfigurationSpec in an in-memory Database
   * @returns {Object} returns the parsed FeeConfigurationSpec object
   */
  static async create(FeeConfigurationSpec) {
    try {
			const fcsArr = FeeConfigurationSpec.split('\n');
      let allowedCurrencies = [],
          availableTypesOfPayment = {};

			for(const data of fcsArr) {
				const [, currency,, paymentType] = data.split(':')[0].split(" ");
				if(!allowedCurrencies.includes(currency)) allowedCurrencies.push(currency);
				if(!availableTypesOfPayment[paymentType.substr(0, paymentType.indexOf("("))]) {
					availableTypesOfPayment[paymentType.substr(0, paymentType.indexOf("("))] = [data];
				} else {
					availableTypesOfPayment[paymentType.substr(0, paymentType.indexOf("("))].push(data)
				}
			}

      await RedisClient.set('currency', JSON.stringify(allowedCurrencies));
      await RedisClient.set('paymentType', JSON.stringify(availableTypesOfPayment));

      return { allowedCurrencies, availableTypesOfPayment };
    } catch (error) {
      throw error;
    }
  }
}