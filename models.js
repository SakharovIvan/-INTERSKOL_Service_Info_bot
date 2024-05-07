const sequelize = require('./bd')
const {DataTypes}= require('sequelize')

const User = sequelize.define('user', {
    id:{type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId:{type:DataTypes.STRING, unique:true},
    msg:{type:DataTypes.STRING}
})

module.exports=User;
