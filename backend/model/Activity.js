module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    owner_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
  });
  return Activity;
};
