'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
    // email: DataTypes.STRING,
    // password: DataTypes.STRING,
    // firstName: DataTypes.STRING,
    // lastName: DataTypes.STRING,
    // address: DataTypes.STRING,
    // gender: DataTypes.STRING,
    // roleId: DataTypes.STRING
      return queryInterface.bulkInsert('Users', [
        { email: 'admin@gmail.com',
          password: '123456',
          firstName: 'Duc Thang',
          lastName: 'Hoang',
          address: 'UK',
          gender: 1,
          typeRole: 'ROLE',
          keyRole: 'R1',
          
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
    },
  };