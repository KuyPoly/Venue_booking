module.exports = (sequelize, DataTypes) => {
  const Payout = sequelize.define('Payout', {
    owner_id: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    status: DataTypes.STRING,
    date: DataTypes.DATE,
  });
  return Payout;
};
