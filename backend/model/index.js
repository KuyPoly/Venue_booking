const Hall = require('./Hall');
const Image = require('./Image');
const Category = require('./Category');
const User = require('./User');
const Booking = require('./Booking');
const Payment = require('./Payment');
const HallCategory = require('./HallCategory');
const HallReservation = require('./HallReservation');
const Favorite = require('./Favorite');
const OwnerWallet = require('./OwnerWallet');
const WalletTransaction = require('./WalletTransaction');
// Add other models as needed

module.exports = { 
  Hall, 
  Image, 
  Category, 
  User, 
  Booking, 
  Payment,
  HallCategory,
  HallReservation,
  Favorite,
  OwnerWallet,
  WalletTransaction
};
