import HttpStatus from "http-status-codes";
import Exception from "./exception";

export default class NotFoundException extends Exception {
    constructor(message: string = `Not Found`) {
        super(HttpStatus.NOT_FOUND, message, `NotFoundException`);
    }
}
