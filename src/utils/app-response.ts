/**
 * Represents an API response.
 */
class ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;

  /**
   * Creates a new ApiResponse instance.
   * @param {number} statusCode - The status code of the response.
   * @param {T} data - The data returned by the API.
   * @param {string} [message="success"] - The message associated with the response.
   */
  constructor(
    statusCode: number,
    message: string = 'success',
    data: T = {} as T
  ) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };
