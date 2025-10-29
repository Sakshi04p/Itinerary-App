const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const trips = sequelize.define(
    'trips',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

title: {
        type: DataTypes.TEXT,

      },

start_date: {
        type: DataTypes.DATE,

      },

end_date: {
        type: DataTypes.DATE,

      },

destination: {
        type: DataTypes.TEXT,

      },

activities: {
        type: DataTypes.TEXT,

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  trips.associate = (db) => {

    db.trips.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.trips.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return trips;
};

