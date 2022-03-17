require('dotenv').config();
const Response = require("../../../utils/constants/Response"),
	RedisClient = require("../../../lib/redis"),
	ComputeService = require("../ComputeService");

/**
 * Handles every business logic that concerns Fee configuration spec
 */
module.exports = class FcsService {
	/**
	 * Creates the parsed FeeConfigurationSpec
	 * @property {Function} create  parse and save FeeConfigurationSpec in an in-memory Database
	 * @returns {Object} returns the parsed FeeConfigurationSpec object
	 */
	static async create(FeeConfigurationSpec) {
		try {
			const fcsArr = FeeConfigurationSpec.split('\n');
			let allowedCurrencies = [],
				availableTypesOfPayment = {};

			for (const data of fcsArr) {
				const [, currency, , paymentType] = data.trim().split(':')[0].split(" ");
				if (!allowedCurrencies.includes(currency)) allowedCurrencies.push(currency);
				if (!availableTypesOfPayment[paymentType.substr(0, paymentType.indexOf("("))]) {
					availableTypesOfPayment[paymentType.substr(0, paymentType.indexOf("("))] = [data];
				} else {
					availableTypesOfPayment[paymentType.substr(0, paymentType.indexOf("("))].push(data)
				}
			}

			RedisClient.set('currency', JSON.stringify(allowedCurrencies), err => {
				if (err) throw err;
			});

			
			for(const type in availableTypesOfPayment) {
				RedisClient.set(`${type}`.toLowerCase(), JSON.stringify(availableTypesOfPayment[type]), err => {
					if (err) throw err;
				});
			}

			return { allowedCurrencies, availableTypesOfPayment };
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Compute transaction fee
	 * @property {Function} compute calculates the transaction fee based on the parsed FeeConfigurationSpec in the Database
	 * @returns {Object} returns the result from the compute transaction fee
	 */
	static async compute({
		PaymentEntity: {
			ID,
			Issuer,
			Brand,
			Number,
			SixID,
			Type: UsersPayment,
			Country 
		},
		BearsFee,
		Currency,
		Amount 
	}) {
		try {

			const LOCAL_COUNTRY = process.env.LOCAL_COUNTRY ? process.env.LOCAL_COUNTRY : 'NG';

			return RedisClient.multi().get('currency').get(`${UsersPayment}`.toLowerCase()).get("*").exec().then(res => {
				let [allowedCurrency, paymentTypes, genericPaymentType] = res;
				paymentTypes = JSON.parse(paymentTypes);

				if (!JSON.parse(allowedCurrency).includes(`${Currency}`)) throw {
					message: `No fee configuration for ${Currency} transactions`,
					statusCode: Response.HTTP_UNPROCESSABLE_ENTITY
				};

				let mostSpecificSpec;
				const applicableSpecs = paymentTypes.filter(payment => {
					const [, , , feeEntity] = payment.trim().split(":")[0].split(" ");
					const entityProperty = feeEntity
						.substr(feeEntity.indexOf("("))
						.trim()
						.split("")
						.slice(1, -1)
						.join("");

					return [ID, Issuer, Brand, Number, SixID].includes(entityProperty) || entityProperty === "*";

				}).filter(spec => {
					const [, , feeLocale] = spec.trim().split(":")[0].split(" ");
					const locale = Country === LOCAL_COUNTRY ? "LOCL" : "INTL"
					return feeLocale === locale;
				});


				if (!applicableSpecs.length) mostSpecificSpec = JSON.parse(genericPaymentType)[0];
				else {
					for (const spec of applicableSpecs) {
						let numberOfAskteris = -1;
						if ((spec.split("*").length - 1) > numberOfAskteris) {
							numberOfAskteris = spec.split("*").length - 1;
							mostSpecificSpec = spec;
						}
					}
				}
				
				return ComputeService.calculate(mostSpecificSpec, { Amount, BearsFee });
			});

		} catch (error) {
			throw error;
		}
	}
}