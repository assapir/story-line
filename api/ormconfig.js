const env = process.env.NODE_ENV || `development`;
const config = require(__dirname + `/config/config.json`)[env];

let entitiesPaths = [];
let migrationsPaths = [];
if (env === `production`) {
    entitiesPaths = ["./lib/src/models/**/*.js"];
    migrationsPaths = ["./lib/src/migrations/**/*.js"];
} else {
    entitiesPaths = ["./src/models/**/*.ts"];
    migrationsPaths = ["./src/migrations/**/*.ts"];
}
module.exports = {
    "type": config.dialect,
    "name": "default",
    "database": config.storage,
    "logging": config.logging || false,
    "synchronize": false,
    "migrationsRun": true,
    "entities": entitiesPaths,
    "migrations": migrationsPaths,
    "cli": {
        "entitiesDir": "src/models",
        "migrationsDir": "src/migrations"
    }
}
