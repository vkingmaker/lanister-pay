/**
 * FcsController route controller
 * @module FcsController
 */

const ApiResponser = require("../../utils/ApiResponser"),
      Response = require("../../utils/constants/Response"),
      FscService = require("../services/fcs");


/**
 * Create a FcsController class
 */
module.exports = class FcsController {

  /**
   * Creates Fees configuration spec
   * @param {Object} _ Http Request object
   * @param {Object} res Http Response object
   * @returns {ApiResponser} formatted success or error response
   */
  static async createFcs(req, res) {
    try {
      const { FeeConfigurationSpec } = req.body;

      await FscService.create(FeeConfigurationSpec)

      return ApiResponser.successResponse(
        res, 
        undefined, 
        'ok',
        Response.HTTP_OK
      );

    } catch (error) {
      return ApiResponser.errorResponse(
        res, 
        error.message, 
        Response.HTTP_INTERNAL_SERVER_ERROR
      );
    }
  }

    /**
   * Compute Transaction Fees
   * @param {Object} _ Http Request object
   * @param {Object} res Http Response object
   * @returns {ApiResponser} formatted success or error response
   */
  static async computeTransactionFee(req, res) {
    try {
      const { Amount, Customer: { BearsFee }, Currency, PaymentEntity } = req.body;

      const transactionFee = await FscService.compute({ PaymentEntity, BearsFee, Currency, Amount });

      return ApiResponser.successResponse(
        res, 
        transactionFee, 
        undefined
      );

    } catch (error) {
      const statusCode = error.statusCode || Response.HTTP_INTERNAL_SERVER_ERROR;
      return ApiResponser.errorResponse(
        res, 
        error.message, 
        statusCode
      );
    }
  }
}