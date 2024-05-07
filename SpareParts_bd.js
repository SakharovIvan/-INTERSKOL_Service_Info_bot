const {Sequelize}= require('sequelize')


module.exports = new Sequelize(
    'SpareParts_bd',
    'root',
    'root',
    {
        host: 'master.d3964b84-7443-4db6-9132-210e9670056d.c.dbaas.selcloud.ru',
        port: '5432',
        dialect: 'postgres'
    }
)