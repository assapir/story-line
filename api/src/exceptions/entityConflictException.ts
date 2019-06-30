import HttpStatus from "http-status-codes";
import Exception from "./exception";

export default class EntityConflictException extends Exception {
    constructor(message: string = HttpStatus.getStatusText(HttpStatus.CONFLICT)) {
        super(HttpStatus.CONFLICT, message, `EntityConflictException`);
    }
}
