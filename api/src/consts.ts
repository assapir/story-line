export const DevelopmentEnvironment: string = `development`;
export const ProductionEnvironment: string = `production`;
export const env: string = process.env.NODE_ENV || DevelopmentEnvironment;
export const config =
  env === ProductionEnvironment
    ? require(__dirname + `/config/config.json`)[env]
    : require(__dirname + `/../config/config.json`)[env];
export const prefix: string = `api`;
export const apiVersion: string = `v1`;

export const jwtSecret =
  config.env === config.ProductionEnvironment
    ? config.jwtSecret
    : process.env.JWT_SECRET;

export const linesPath: string = `/${prefix}/${apiVersion}/lines`;
export const usersPath: string = `/${prefix}/${apiVersion}/users`;
export const storiesPath: string = `/${prefix}/${apiVersion}/stories`;
