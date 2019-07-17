import { NextFunction, Request, Response } from "express";
import UnauthorizedException from "../exceptions/unauthorizedException";
import CryptoService from "../services/cryptoService";

export default class AuthMiddleware {

    private readonly _cryptoService: CryptoService;

    constructor(cryptoService: CryptoService) {
        this._cryptoService = cryptoService;
        this.checkJwt = this.checkJwt.bind(this);
    }

    // if the token is not valid, throw 401
    public async checkJwt(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authorizationValue = req.headers[`authorization`];
            if (!authorizationValue) {
                throw new UnauthorizedException(`no authorization header`);
            }

            const split =  authorizationValue.split(` `, 2);
            if (split.length !== 2) {
                throw new UnauthorizedException(`authorization header should be 'Bearer' and the JWT Token`);
            }

            if (split[0] !== `Bearer`) {
                throw new UnauthorizedException(`only Bearer auth is supported`);
            }

            const tokenPayload = this._cryptoService.verifyJWT(split[1]);
            if (!tokenPayload.isValid) {
                throw new UnauthorizedException(`token is invalid`);
            }

            // if valid - renew the token
            const newToken = this._cryptoService.signJWT(tokenPayload);
            res.setHeader(`authorization`, `Bearer ${newToken}`);
            next();
        } catch (error) {
            next(error);
        }
    }
}
