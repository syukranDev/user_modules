module.exports = (sequelize, Sequelize) => {
    var model = sequelize.define('users', {
      id:{
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: true
      },
      password:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      role:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      full_name:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      active:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      phone:{
        type: Sequelize.TEXT,
        allowNull: true
      },
      email:{
        type: Sequelize.TEXT,
        allowNull: true
      },
      age:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      birth_date:{
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      created_by:{
        type: Sequelize.TEXT,
        allowNull: false
      }
    },{
      timestamps: true,
      underscored: true,
      freezeTableName: true
    });
    return model;
  }