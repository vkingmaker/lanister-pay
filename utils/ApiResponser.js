/**
 * ApiResponser module
 * @module ApiResponser
 */
const Response = require('./constants/Response');

/**
 * Formats the success and error responses
 */
module.exports = class ApiResponser {
  /**
   * Formats the success Response
   * @property {Function} successResponse sends back the Http response to the user
   * @param {Object} res Http Response object
   * @param {Array<Object>|Object} data Response data that will be sent back to the user
   * @param {string} message Success message
   * @param {number} statusCode Http status code
   * @returns {Object} The built server response
   */
  static successResponse(res, data, status = undefined, statusCode = Response.HTTP_OK) {
    return res.status(statusCode).send({ ...data, status });
  }

  /**
   * Formats the error Response
   * @param {Object} res Http Reponse
   * @param {string} message error message
   * @param {number} statusCode Http status code
   * @returns {Object} The built server response
   */
  static errorResponse(res, message, statusCode) {
    return res.status(statusCode).send({ 'Error': message });
  }
}