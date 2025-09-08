import { HTTPException } from "hono/http-exception";

export class BadRequestException extends HTTPException {
  private _errors?: string[];

  constructor(message: string, errors?: string[]) {
    super(400, { message });
    this._errors = errors;
  }

  get errors() {
    return this._errors;
  }
}

export class UnauthorizedException extends HTTPException {
  constructor(message: string) {
    super(401, { message });
  }
}

export class ConflictException extends HTTPException {
  constructor(message: string) {
    super(409, { message });
  }
}

export class NotFoundException extends HTTPException {
  constructor(message: string) {
    super(404, { message });
  }
}

export class ForbiddenException extends HTTPException {
  constructor(message: string) {
    super(403, { message });
  }
}

export class TimeoutException extends HTTPException {
  constructor(message: string) {
    super(408, { message });
  }
}
