import { NextFunction, Request, Response } from "express";
import NotAllowedException from "../exceptions/notAllowedException";
import NotFoundException from "../exceptions/notFoundException";
import UnauthorizedException from "../exceptions/unauthorizedException";
import User, { Role } from "../models/user";
import CryptoService, { IPayLoad } from "../services/cryptoService";
import UserService from "../services/userService";

export default class AuthMiddleware {

    private readonly _cryptoService: CryptoService;
    private readonly _userService: UserService;

    constructor(cryptoService: CryptoService, userService: UserService) {
        this._cryptoService = cryptoService;
        this._userService = userService;
        this.checkToken = this.checkToken.bind(this);
        this.checkRole = this.checkRole.bind(this);
    }

    // if the token is not valid, throw 401
    public async checkToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authorizationValue = req.headers[`authorization`];
            if (!authorizationValue) {
                throw new UnauthorizedException(`no authorization header`);
            }

            const split = authorizationValue.split(` `, 2);
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

            res.locals.jwtToken = tokenPayload;
            // if valid - renew the token
            const newToken = this._cryptoService.signJWT(tokenPayload);
            res.setHeader(`authorization`, `Bearer ${newToken}`);
            next();
        } catch (error) {
            next(error);
        }
    }

    public checkRole(role: Role): (req: Request, res: Response, next: NextFunction) => Promise<void> {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                const token = res.locals.jwtPayload as IPayLoad;
                if (!token) {
                    throw new UnauthorizedException(`no token`);
                }

                if (!token.isValid) {
                    throw new UnauthorizedException(`token is invalid`);
                }

                if (!token.id) {
                    throw new UnauthorizedException(`token has no user id`);
                }

                let user: User;
                try {
                    user = await this._userService.getUser(token.id);
                } catch (error) {
                    if (!(error instanceof NotFoundException)) {
                        throw error;
                    }
                    throw new UnauthorizedException(`user is invalid`);
                }
                if (role < user.role) {
                    throw new NotAllowedException(`user in not allowed to access '${req.path}'`);
                }
                next();
            } catch (error) {
                next(error);
            }
        };
    }
}
