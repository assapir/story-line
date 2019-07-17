import { Application, NextFunction, Request, Response, Router } from "express";
import BadRequestException from "../exceptions/badRequestException";
import unauthorizedException from "../exceptions/unauthorizedException";
import CryptoService from "../services/cryptoService";
import UserService from "../services/userService";
import { sendResult } from "./controllerUtils";

class AuthController {

    private readonly _userService: UserService;
    private readonly _cryptoService: CryptoService;

    constructor(app: Application, userService: UserService, cryptoService: CryptoService) {
        this.initializeRouter(app);
        this._userService = userService;
        this._cryptoService = cryptoService;
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new BadRequestException(`no password and no user email given`);
            }
            const user = await this._userService.getUserByEmail(email);
            const isCorrect = await user.isPasswordCorrect(password);
            if (!isCorrect) {
                throw new unauthorizedException(`password is incorrect`);
            }

            const token = this._cryptoService.signJWT({
                id: user.id,
                email: user.email,
                isValid: true});

            sendResult(res, token);
        } catch (error) {
            // we want to always return this error
            next(new unauthorizedException(`password or user are incorrect`));
        }
    }

    private initializeRouter(app: Application): void {
        const router = Router();
        router.post(`/login`, this.login.bind(this));
        app.use(router);
    }
}

export default (app: Application, userService: UserService, cryptoService: CryptoService) =>
                    new AuthController(app, userService, cryptoService);
