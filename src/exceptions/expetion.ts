export default class Exception extends Error {

    private _statusCode: number;

    get statusCode() {
        return this._statusCode;
    }

    constructor(statusCode: number, message: string) {
        super(message);
        this._statusCode = statusCode;
    }
}
