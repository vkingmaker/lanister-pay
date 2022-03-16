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
        'ok'
      );

    } catch (error) {
      return ApiResponser.errorResponse(
        res, 
        error.message, 
        Response.HTTP_INTERNAL_SERVER_ERROR
      );
    }
  }
}