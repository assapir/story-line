const env = process.env.NODE_ENV || `development`;
const config = require(__dirname + `/config/config.json`)[env];

module.exports = {
    "type": config.dialect,
    "name": "default",
    "database": config.storage,
    "logging": true,
    "synchronize": false,
    "migrationsRun": true,
    "entities": [
        "src/models/**/*.ts"
    ],
    "migrations": [
        "src/migrations/**/*.ts"
    ],
    "cli": {
        "entitiesDir": "src/models",
        "migrationsDir": "src/migrations"
    }
}
