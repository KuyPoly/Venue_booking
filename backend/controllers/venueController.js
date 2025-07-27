const Hall = require('../model/Hall');
const Category = require('../model/Category');
const Image = require('../model/Image');

// Ensure associations are loaded
require('../model/Association');

exports.testVenues = async (req, res) => {
  try {
    const venues = await Hall.findAll({ limit: 5 });
    res.json({
      count: venues.length,
      venues: venues.map(v => ({
        id: v.hall_id,
        name: v.name,
        location: v.location,
        capacity: v.capacity,
        price: v.price
      }))
    });
  } catch (error) {
    console.error('Test venues error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.debugVenues = async (req, res) => {
  try {
    const venues = await Hall.findAll({
      include: [
        { model: Image, as: 'images', attributes: ['url', 'order'], required: false },
        { model: Category, as: 'categories', through: { attributes: [] }, attributes: ['id', 'name'], required: false }
      ],
      limit: 5
    });
    const categories = await Category.findAll();
    
    res.json({
      totalVenues: venues.length,
      totalCategories: categories.length,
      categories: categories.map(c => ({ id: c.id, name: c.name })),
      venues: venues.map(v => ({
        id: v.hall_id,
        name: v.name,
        location: v.location,
        imageCount: v.images ? v.images.length : 0,
        categoryCount: v.categories ? v.categories.length : 0,
        categories: v.categories ? v.categories.map(c => c.name) : []
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getVenues = async (req, res) => {
  try {
    console.log('🔍 Getting venues...'); // Debug log
    const { category } = req.query;
    
    // Add connection timeout handling
    const connectionTimeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 10000);
    });
    
    const queryPromise = (async () => {
      // First, check if we have any halls at all
      const totalHalls = await Hall.count();
      console.log(`📊 Total halls in database: ${totalHalls}`);
      
      if (totalHalls === 0) {
        console.log('⚠️ No halls found in database');
        return [];
      }
      
      let whereClause = {};
      let include = [
        { 
          model: Image, 
          as: 'images', 
          attributes: ['id', 'url', 'order'], 
          required: false
        }
      ];

      if (category) {
        console.log(`🏷️ Filtering by category: ${category}`); // Debug log
        include.push({
          model: Category, 
          as: 'categories', 
          where: { name: category },
          through: { attributes: [] }, 
          attributes: ['id', 'name'],
          required: true
        });
      } else {
        include.push({
          model: Category, 
          as: 'categories', 
          through: { attributes: [] }, 
          attributes: ['id', 'name'],
          required: false
        });
      }

      console.log('🔍 Executing Hall.findAll query...'); // Debug log
      console.log('📋 Query includes:', JSON.stringify(include, null, 2)); // Debug log
      
      const venues = await Hall.findAll({
        where: whereClause,
        include: include,
        order: [['created_at', 'DESC']]
      });
      
      console.log(`📊 Raw venues found: ${venues.length}`); // Debug log
      return venues;
    })();
    
    // Race between query and timeout
    let venues;
    try {
      venues = await Promise.race([queryPromise, connectionTimeout]);
    } catch (timeoutError) {
      console.error('❌ Database timeout or connection error:', timeoutError.message);
      // Return empty array instead of crashing
      return res.json([]);
    }
    
    // Handle empty result gracefully
    if (!venues || venues.length === 0) {
      console.log('⚠️ No venues found with current query');
      return res.json([]); // Return empty array instead of error
    }
    
    console.log('🔄 Transforming venues...'); // Debug log
    
    const transformedVenues = venues.map(venue => {
      const transformed = {
        id: venue.hall_id,
        name: venue.name,
        description: venue.description,
        location: venue.location,
        capacity: venue.capacity,
        price: venue.price,
        openHour: venue.open_hour,
        closeHour: venue.close_hour,
        // Handle both Cloudinary URLs and legacy local URLs
        image: venue.images && venue.images.length > 0 
          ? venue.images[0].url // Cloudinary URLs are already complete
          : null,
        categories: venue.categories ? venue.categories.map(cat => cat.name) : []
      };
      
      console.log(`✅ Transformed venue: ${transformed.name} (ID: ${transformed.id})`); // Debug log
      return transformed;
    });
    
    console.log(`📤 Returning ${transformedVenues.length} venues`); // Debug log
    res.json(transformedVenues); // Ensure we always return an array
  } catch (error) {
    console.error('❌ Venues error:', error);
    console.error('❌ Error stack:', error.stack); // More detailed error
    // Return empty array with error info instead of 500 error - this prevents frontend crashes
    console.log('🔄 Returning empty array due to database error');
    res.json([]); // Changed from 500 error to empty array
  }
};

exports.getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching venue details for ID:', id); // Debug log
    
    const venue = await Hall.findByPk(id, {
      include: [
        { 
          model: Image, 
          as: 'images', 
          attributes: ['id', 'url', 'order'], 
          order: [['order', 'ASC']] 
        },
        { 
          model: Category, 
          as: 'categories', 
          through: { attributes: [] }, 
          attributes: ['id', 'name'] 
        }
      ]
    });
    
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    console.log('Raw venue images:', venue.images); // Debug log
    
    const transformedVenue = {
      id: venue.hall_id,
      name: venue.name,
      description: venue.description,
      location: venue.location,
      capacity: venue.capacity,
      price: venue.price,
      openHour: venue.open_hour,
      closeHour: venue.close_hour,
      latitude: venue.latitude,
      longitude: venue.longitude,
      address: venue.address,
      // Handle both Cloudinary URLs and legacy local URLs
      images: venue.images ? venue.images.map(img => 
        img.url // Cloudinary URLs are already complete, no need to modify
      ) : [],
      categories: venue.categories ? venue.categories.map(cat => cat.name) : []
    };
    
    console.log('Transformed venue:', transformedVenue); // Debug log
    res.json(transformedVenue);
  } catch (error) {
    console.error('Venue detail error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};