export class UnauthorizedError extends Error {
  constructor(message = 'Authorization required') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}
