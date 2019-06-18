import HttpStatus from "http-status-codes";
import Exception from "./exception";

export default class NotAllowedException extends Exception {
    constructor(message: string = HttpStatus.getStatusText(HttpStatus.FORBIDDEN)) {
        super(HttpStatus.FORBIDDEN, message, `NotAllowedException`);
    }
 }
