export const DevelopmentEnvironment: string = `development`;
export const ProductionEnvironment: string = `production`;
export const env = process.env.NODE_ENV || DevelopmentEnvironment;
export const config = require(__dirname + `/../config/config.json`)[env];
