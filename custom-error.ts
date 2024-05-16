export class CustomError extends Error {
    constructor(message:string) {
      super(message);
      this.name = "CustomError"; // Helps with distinguishing error types
    }
  }