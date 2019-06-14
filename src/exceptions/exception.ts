export default class Exception extends Error {

    private _statusCode: number;
    private _name: string;

    public get statusCode() {
        return this._statusCode;
    }

    public get name() {
        return this._name;
    }

    constructor(statusCode: number, message: string, name: string) {
        super(message);
        this._statusCode = statusCode;
        this._name = name;
    }
}
