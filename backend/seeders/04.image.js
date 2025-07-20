'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('image', [
      // Images for Hall 1 (Wedding Hall)
      { url: 'https://i.pinimg.com/1200x/74/ad/83/74ad830e53cfa48a44dadaf4906db2e0.jpg', order: 1, hall_id: 1, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/736x/f3/77/a0/f377a0d8cecfc2294ff11b88bb60d1bb.jpg', order: 2, hall_id: 1, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/0d/6e/58/0d6e587c3a58a11fabf4bfa695e822b1.jpg', order: 3, hall_id: 1, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/31/60/5e/31605ebec35df8da6ab2ecbfe619b578.jpg', order: 4, hall_id: 1, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 2 (Conference Hall)
      { url: 'https://i.pinimg.com/736x/55/ee/27/55ee27a41718bfdd2972518c7ddb7006.jpg', order: 1, hall_id: 2, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/6b/2f/22/6b2f22b4d305fecafa3996e92dbb853c.jpg', order: 2, hall_id: 2, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/f6/9c/c4/f69cc44cd4a5681fffe3de0a8eadd1aa.jpg', order: 3, hall_id: 2, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 3 (Meeting Room)
      { url: 'https://i.pinimg.com/736x/22/ff/2a/22ff2abfdf5f2c85fbb4bbc96d3ce975.jpg', order: 1, hall_id: 3, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/736x/9e/5d/ac/9e5dac42ab539dcaa72c8db8b7807a9f.jpg', order: 2, hall_id: 3, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/736x/ab/67/d8/ab67d85281efd5b70be25c47f93b4b58.jpg', order: 3, hall_id: 3, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 4 (Party Hall)
      { url: 'https://i.pinimg.com/1200x/2c/3d/14/2c3d148d77cf560d6e0fb9f1e2255826.jpg', order: 1, hall_id: 4, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/49/36/63/493663f1741364d923f8310d1dc0df13.jpg', order: 2, hall_id: 4, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/61/88/33/6188334be66547efdc0974dc0577da6c.jpg', order: 3, hall_id: 4, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 5 (Workshop Space)
      { url: 'https://i.pinimg.com/736x/fb/e1/40/fbe1407663f8d74ccf9621353f451824.jpg', order: 1, hall_id: 5, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/736x/66/de/19/66de190c2ac5cfacbb55d544ca8dad6d.jpg', order: 2, hall_id: 5, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/e4/44/2b/e4442bf8f895c1e8b22cd628feaa56f9.jpg', order: 3, hall_id: 5, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 6 (Grand Ballroom)
      { url: 'https://i.pinimg.com/736x/f3/77/a0/f377a0d8cecfc2294ff11b88bb60d1bb.jpg', order: 1, hall_id: 6, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/7c/36/fb/7c36fbf68189adead1452073770b6199.jpg', order: 2, hall_id: 6, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/4d/29/57/4d2957bda9ef37f3a8f3aa4a9131a92a.jpg', order: 3, hall_id: 6, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 7 (Executive Conference)
      { url: 'https://i.pinimg.com/736x/55/ee/27/55ee27a41718bfdd2972518c7ddb7006.jpg', order: 1, hall_id: 7, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/f6/9c/c4/f69cc44cd4a5681fffe3de0a8eadd1aa.jpg', order: 2, hall_id: 7, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/d1/3d/87/d13d87a7987ddd9de7becdb2c9a193ac.jpg', order: 3, hall_id: 7, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/ce/3c/44/ce3c4418af5309008315e3fb4ad4bb75.jpg', order: 4, hall_id: 7, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 8 (Birthday Party Hall)
      { url: 'https://i.pinimg.com/1200x/da/d3/64/dad36456974deaf85a8d2abcaabb67dd.jpg', order: 1, hall_id: 8, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/4f/8d/a1/4f8da15b82720ce4db8479a64ebd046a.jpg', order: 2, hall_id: 8, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/82/3a/51/823a51c6910241969105ee96050eb0c9.jpg', order: 3, hall_id: 8, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 9 (Training Workshop)
      { url: 'https://i.pinimg.com/1200x/21/e9/ae/21e9aed35a70dcfcc9d61d811a6b4d05.jpg', order: 1, hall_id: 9, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/4d/56/40/4d56407e250b96b8ca6fcdf3a2556922.jpg', order: 2, hall_id: 9, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/79/e2/9e/79e29ed08ee0274484d0be7b40af177d.jpg', order: 3, hall_id: 9, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 10 (Garden Wedding Venue)
      { url: 'https://i.pinimg.com/1200x/41/d5/19/41d5199599f9ad1d9bdb0eb4f6600fdb.jpg', order: 1, hall_id: 10, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/736x/37/c6/25/37c625c8a1a09d739e4c3288ed54341a.jpg', order: 2, hall_id: 10, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/0d/74/33/0d74335127f3a1abebab459da4e35ed6.jpg', order: 3, hall_id: 10, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 11 (Corporate Auditorium)
      { url: 'https://i.pinimg.com/736x/55/ee/27/55ee27a41718bfdd2972518c7ddb7006.jpg', order: 1, hall_id: 11, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/6b/2f/22/6b2f22b4d305fecafa3996e92dbb853c.jpg', order: 2, hall_id: 11, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/f6/9c/c4/f69cc44cd4a5681fffe3de0a8eadd1aa.jpg', order: 3, hall_id: 11, created_at: new Date(), updated_at: new Date() },
      
      // Images for Hall 12 (Cocktail Lounge)
      { url: 'https://i.pinimg.com/1200x/2c/3d/14/2c3d148d77cf560d6e0fb9f1e2255826.jpg', order: 1, hall_id: 12, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/49/36/63/493663f1741364d923f8310d1dc0df13.jpg', order: 2, hall_id: 12, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/61/88/33/6188334be66547efdc0974dc0577da6c.jpg', order: 3, hall_id: 12, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 13 (Art Workshop Studio)
      { url: 'https://i.pinimg.com/1200x/51/06/29/5106290836362e0e86f1d27017884d60.jpg', order: 1, hall_id: 13, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/736x/42/89/8f/42898f3246454ed69538840bfacfff21.jpg', order: 2, hall_id: 13, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/736x/e3/ba/3e/e3ba3e5fb6db9b4470fe1c387fceb997.jpg', order: 3, hall_id: 13, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 14 (Boardroom Elite)
      { url: 'https://i.pinimg.com/736x/55/ee/27/55ee27a41718bfdd2972518c7ddb7006.jpg', order: 1, hall_id: 14, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/6b/2f/22/6b2f22b4d305fecafa3996e92dbb853c.jpg', order: 2, hall_id: 14, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/f6/9c/c4/f69cc44cd4a5681fffe3de0a8eadd1aa.jpg', order: 3, hall_id: 14, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 15 (Rooftop Party Deck)
      { url: 'https://i.pinimg.com/1200x/9a/46/69/9a4669e5ebdacc52a853c078708a8657.jpg', order: 1, hall_id: 15, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/3f/48/4e/3f484e67fc16892892edc5fc0a4a619b.jpg', order: 2, hall_id: 15, created_at: new Date(), updated_at: new Date() },


      // Images for Hall 16 (Vintage Wedding Chapel)
      { url: 'https://i.pinimg.com/1200x/74/ad/83/74ad830e53cfa48a44dadaf4906db2e0.jpg', order: 1, hall_id: 16, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/736x/f3/77/a0/f377a0d8cecfc2294ff11b88bb60d1bb.jpg', order: 2, hall_id: 16, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/0d/6e/58/0d6e587c3a58a11fabf4bfa695e822b1.jpg', order: 3, hall_id: 16, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/31/60/5e/31605ebec35df8da6ab2ecbfe619b578.jpg', order: 4, hall_id: 16, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 17 (Tech Innovation Lab)
      { url: 'https://i.pinimg.com/1200x/21/e9/ae/21e9aed35a70dcfcc9d61d811a6b4d05.jpg', order: 1, hall_id: 17, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/4d/56/40/4d56407e250b96b8ca6fcdf3a2556922.jpg', order: 2, hall_id: 17, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/79/e2/9e/79e29ed08ee0274484d0be7b40af177d.jpg', order: 3, hall_id: 17, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 18 (Community Center Hall)
      { url: 'https://i.pinimg.com/736x/55/ee/27/55ee27a41718bfdd2972518c7ddb7006.jpg', order: 1, hall_id: 18, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/6b/2f/22/6b2f22b4d305fecafa3996e92dbb853c.jpg', order: 2, hall_id: 18, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/f6/9c/c4/f69cc44cd4a5681fffe3de0a8eadd1aa.jpg', order: 3, hall_id: 18, created_at: new Date(), updated_at: new Date() },
      
      // Images for Hall 19 (Luxury Banquet Hall)
      { url: 'https://i.pinimg.com/1200x/74/ad/83/74ad830e53cfa48a44dadaf4906db2e0.jpg', order: 1, hall_id: 19, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/736x/f3/77/a0/f377a0d8cecfc2294ff11b88bb60d1bb.jpg', order: 2, hall_id: 19, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/0d/6e/58/0d6e587c3a58a11fabf4bfa695e822b1.jpg', order: 3, hall_id: 19, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/1200x/31/60/5e/31605ebec35df8da6ab2ecbfe619b578.jpg', order: 4, hall_id: 19, created_at: new Date(), updated_at: new Date() },

      // Images for Hall 20 (Startup Meetup Space)
      { url: 'https://i.pinimg.com/736x/22/ff/2a/22ff2abfdf5f2c85fbb4bbc96d3ce975.jpg', order: 1, hall_id: 20, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/736x/9e/5d/ac/9e5dac42ab539dcaa72c8db8b7807a9f.jpg', order: 2, hall_id: 20, created_at: new Date(), updated_at: new Date() },
      { url: 'https://i.pinimg.com/736x/ab/67/d8/ab67d85281efd5b70be25c47f93b4b58.jpg', order: 3, hall_id: 20, created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('image', null, {});
  }
};