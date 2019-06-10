export default class NotFoundException extends Error {
    private _statusCode: number;

    get statusCode() {
        return this._statusCode;
    }

    constructor(statusCode: number = 404, message: string = "Not found") {
        super(message);
        this._statusCode = statusCode;
    }
}
