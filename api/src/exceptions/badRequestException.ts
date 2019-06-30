import HttpStatus from "http-status-codes";
import Exception from "./exception";

export default class BadRequestException extends Exception {
    constructor(message: string = `Bad Request`) {
        super(HttpStatus.BAD_REQUEST, message, `BadRequestException`);
    }
}
