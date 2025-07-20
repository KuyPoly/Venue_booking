// --- New Associations ---
const Hall = require('./Hall');
const Image = require('./Image');
const Category = require('./Category');
const HallCategory = require('./HallCategory');
const Favorite = require('./Favorite');
const User = require('./User');
const Booking = require('./Booking');
const HallReservation = require('./HallReservation');
const Payment = require('./Payment');


// Booking - User (One-to-Many)
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });

// HallReservation - Booking (One-to-Many)
HallReservation.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
Booking.hasMany(HallReservation, { foreignKey: 'booking_id', as: 'hall_reservations' });

HallReservation.belongsTo(Hall, { foreignKey: 'hall_id', as: 'hall' });
Hall.hasMany(HallReservation, { foreignKey: 'hall_id', as: 'hall_reservations' });

// Payment - Booking (One-to_One)
Payment.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
Booking.hasOne(Payment, { foreignKey: 'booking_id', as: 'payment' });


// Hall - Image (One-to-Many)
Hall.hasMany(Image, { foreignKey: 'hall_id', as: 'images' });
Image.belongsTo(Hall, { foreignKey: 'hall_id', as: 'hall' });

// Hall - Category (Many-to-Many through HallCategory)
Hall.belongsToMany(Category, { through: HallCategory, foreignKey: 'hall_id', otherKey: 'category_id', as: 'categories' });
Category.belongsToMany(Hall, { through: HallCategory, foreignKey: 'category_id', otherKey: 'hall_id', as: 'halls' });

// User - Hall (Many-to-Many through Favorite)
User.belongsToMany(Hall, { through: Favorite, foreignKey: 'user_id', otherKey: 'hall_id', as: 'favorite_halls' });
Hall.belongsToMany(User, { through: Favorite, foreignKey: 'hall_id', otherKey: 'user_id', as: 'favorited_by_users' });

// Each favorite belongs to a user and a hall
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Favorite.belongsTo(Hall, { foreignKey: 'hall_id', as: 'hall' });

// Optionally, if you want to get all favorites for a user or hall:
User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' });
Hall.hasMany(Favorite, { foreignKey: 'hall_id', as: 'favorites' });