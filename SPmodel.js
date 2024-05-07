const { DataTypes } = require('sequelize');
const sequelizeSP = require('./SpareParts_bd')

const SparePart = sequelizeSP.define('sparePart',{
   // id:{type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    sp:{type: DataTypes.STRING,primaryKey: true,unique: true},
    name:{type:DataTypes.STRING},
    tools:{type: DataTypes.ARRAY}
})

module.exports=SparePart;