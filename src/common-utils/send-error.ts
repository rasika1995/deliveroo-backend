import e, { Response } from 'express';

export function sendError(
  res: Response,
  statusCode: number,
  customError?: string,
): void {
  let error = '';
  switch (statusCode) {
    case 400:
      error = 'Bad request';
      break;
    case 401:
      error = 'Unauthorized';
      break;
    case 403:
      error = 'Forbidden';
      break;
    case 404:
      error = `Not Found`;
      break;
    default:
      error = 'Internal server error';
  }
  const errorResponse = { error: customError || error };
  res.status(statusCode).json(errorResponse);
}
