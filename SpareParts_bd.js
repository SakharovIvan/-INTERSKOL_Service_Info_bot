const {Sequelize}= require('sequelize')


module.exports = new Sequelize(
    'SpareParts_bd',
    'root',
    'root',
    {
        host: '192.168.0.74',
        port: '5432',
        dialect: 'postgres'
    }
)