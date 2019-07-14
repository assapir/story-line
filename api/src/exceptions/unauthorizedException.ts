import HttpStatus from "http-status-codes";
import Exception from "./exception";

export default class UnauthorizedException extends Exception {
    constructor(message: string = HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED)) {
        super(HttpStatus.UNAUTHORIZED, message, `UnauthorizedException`);
    }
}
