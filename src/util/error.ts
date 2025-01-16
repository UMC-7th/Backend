export class AlreadyExistError extends Error {
  errorCode: string = "ALREADY_EXIST";
  reason: string;
  data: any;

  constructor(reason: string, data: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NotFoundError extends Error {
  errorCode: string = "DATA_NOT_FOUND";
  reason: string;
  data: any;

  constructor(reason: string, data: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class InvalidInputError extends Error {
  errorCode: string = "INVALID_INPUT";
  reason: string;
  data: any;

  constructor(reason: string, data: any) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
