const {Sequelize}= require('sequelize')


module.exports = new Sequelize(
    'telega_bot',
    'root',
    'root',
    {
        host: 'master.d3964b84-7443-4db6-9132-210e9670056d.c.dbaas.selcloud.ru',
        port: '5432',
        dialect: 'postgres'
    }
)