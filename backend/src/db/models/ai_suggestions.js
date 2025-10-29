const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const ai_suggestions = sequelize.define(
    'ai_suggestions',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

suggestion: {
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

  ai_suggestions.associate = (db) => {

    db.ai_suggestions.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.ai_suggestions.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return ai_suggestions;
};

