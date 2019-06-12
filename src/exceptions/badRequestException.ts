import Exception from "./expetion";

export default class BadRequestException extends Exception {
    constructor(message: string = `Bad Request`) {
        super(400, message);
    }
}
