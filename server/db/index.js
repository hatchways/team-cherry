const {Sequelize} = require('sequelize')

const db = new Sequelize(
    process.env.DB_NAME || 'db name not set',
    process.env.DB_USERNAME || 'postgres',
    process.env.DB_PASSWORD || 'password',
    {host: 'localhost', dialect: 'postgres'});

module.exports = db