export interface IApiError {
  status: number;
  code: string;
  message: string;
  timestamp: string;
}

export class ApiError extends Error implements IApiError {
  status: number;
  code: string;
  timestamp: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Error code constants
export const ErrorCodes = {
  INVALID_TIME_RANGE: 'INVALID_TIME_RANGE',
  BOOKING_OVERLAP: 'BOOKING_OVERLAP',
  BOOKING_IN_PAST: 'BOOKING_IN_PAST',
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  BOOKING_NOT_FOUND: 'BOOKING_NOT_FOUND',
  INVALID_EMAIL: 'INVALID_EMAIL',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_NAME: 'INVALID_NAME',
  BOOKER_EMAIL_ALREADY_IN_USE: 'BOOKER_EMAIL_ALREADY_IN_USE'
};
