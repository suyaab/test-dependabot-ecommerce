export default class ActionException extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);

    this.name = "ActionException";
  }
}
