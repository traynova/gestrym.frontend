export class ApiError extends Error {
  public status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;

    // Restaurar la cadena de prototipos (Built-in en TypeScript)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
