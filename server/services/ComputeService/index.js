const { FLAT_PERC, PERC } = require("../../../utils/constants/FeeType");

/**
 * Calculating the response Object
 */
module.exports = class ComputeService {
	/**
   * Calculate and  build up the response Object
   * @property {Function} calculate calculates the AppliedFee, ChargeAmount and SettlementAmount
   * @returns {Object} returns the result from the compute transaction fee
   */
  static async calculate(mostSpecificSpec, { Amount, BearsFee }) {
    try {	
			const [ AppliedFeeID ] = mostSpecificSpec.trim().split(" "),
						[, feeType, feeValue ] =  mostSpecificSpec.substr(mostSpecificSpec.indexOf(":")+1).trim().split(" ");
			
			let AppliedFeeValue;

			switch(feeType) {
				case PERC: {
					AppliedFeeValue = Math.ceil(parseFloat(feeValue/100 * +Amount));
					break;
				}
				case FLAT_PERC: {
					const [flat, perc] = feeValue.split(":");
					AppliedFeeValue = Math.ceil(parseFloat(((perc/100) * Amount)+ +flat));
					break;
				}
				
				default: {
					AppliedFeeValue = parseFloat(feeValue);
					break;
				}
			}
			
			const ChargeAmount = Boolean(BearsFee) ? (Amount + AppliedFeeValue): Amount,
						SettlementAmount = ChargeAmount - AppliedFeeValue;
			
			return { AppliedFeeID, AppliedFeeValue, ChargeAmount, SettlementAmount}
    } catch (error) {
      throw error;
    }
  }
}