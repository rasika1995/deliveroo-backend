import { Response } from 'express';

export function sendResponse(
  res: Response,
  statusCode: number,
  customMessage?: string,
  data?: any,
): void {
  let message = '';
  switch (statusCode) {
    case 200:
      message = 'OK';
      break;
    case 201:
      message = 'Created';
      break;
    case 204:
      message = 'No Content';
      break;
    default:
      message = '';
  }
  const response = { data, message: customMessage || message };
  res.status(statusCode).json(response);
}
