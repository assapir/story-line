import Exception from "./expetion";

export default class NotFoundException extends Exception {
    constructor(message: string = `Not Found`) {
        super(404, message);
    }
}
