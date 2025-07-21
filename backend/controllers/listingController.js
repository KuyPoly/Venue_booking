const Hall = require('../model/Hall');
const Image = require('../model/Image');
const Category = require('../model/Category');
const HallCategory = require('../model/HallCategory');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/venues/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'venue-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware to handle multiple file uploads
exports.uploadImages = upload.array('images', 5);

// Get all listings for a specific owner
exports.getAllListings = async (req, res) => {
  try {
    const { owner_id } = req.query;
    
    if (!owner_id) {
      return res.status(400).json({ error: 'Owner ID is required' });
    }

    const listings = await Hall.findAll({
      where: { owner_id },
      include: [
        { 
          model: Image, 
          as: 'images', 
          attributes: ['url', 'order'], 
          order: [['order', 'ASC']],
          required: false 
        },
        { 
          model: Category, 
          as: 'categories', 
          through: { attributes: [] }, 
          attributes: ['id', 'name'],
          required: false 
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const transformedListings = listings.map(hall => ({
      id: hall.hall_id,
      name: hall.name,
      type: hall.type,
      description: hall.description,
      location: hall.location,
      capacity: hall.capacity,
      price: hall.price,
      openHour: hall.open_hour,
      closeHour: hall.close_hour,
      images: hall.images ? hall.images.map(img => `http://localhost:5000/${img.url}`) : [],
      categories: hall.categories ? hall.categories.map(cat => ({ id: cat.id, name: cat.name })) : [],
      createdAt: hall.created_at,
      updatedAt: hall.updated_at
    }));

    res.json({
      message: `Found ${transformedListings.length} listings for owner ${owner_id}`,
      listings: transformedListings
    });
  } catch (err) {
    console.error('Error fetching owner listings:', err);
    res.status(500).json({ error: 'Failed to fetch your listings' });
  }
};

// Get a specific listing by ID
exports.getListingById = async (req, res) => {
  try {
    const { owner_id } = req.query;
    
    const listing = await Hall.findOne({
      where: { 
        hall_id: req.params.id,
        owner_id
      },
      include: [
        { 
          model: Image, 
          as: 'images', 
          attributes: ['url', 'order'], 
          order: [['order', 'ASC']],
          required: false 
        },
        { 
          model: Category, 
          as: 'categories', 
          through: { attributes: [] }, 
          attributes: ['id', 'name'],
          required: false 
        }
      ]
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found or you do not have permission to access it' });
    }

    const transformedListing = {
      id: listing.hall_id,
      name: listing.name,
      type: listing.type,
      description: listing.description,
      location: listing.location,
      capacity: listing.capacity,
      price: listing.price,
      openHour: listing.open_hour,
      closeHour: listing.close_hour,
      ownerId: listing.owner_id,
      images: listing.images ? listing.images.map(img => `http://localhost:5000/${img.url}`) : [],
      categories: listing.categories ? listing.categories.map(cat => ({ id: cat.id, name: cat.name })) : [],
      createdAt: listing.created_at,
      updatedAt: listing.updated_at
    };

    res.json(transformedListing);
  } catch (err) {
    console.error('Error fetching listing:', err);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
};

// Create a new listing
// Update the createListing function
exports.createListing = async (req, res) => {
  try {
    console.log('Received body:', req.body);
    console.log('Received files:', req.files);

    const {
      name,
      description,
      location,
      capacity,
      price,
      open_hour,
      close_hour,
      owner_id,
      categories
    } = req.body;

    // Validate required fields - REMOVED 'type'
    if (!name || !description || !location || !capacity || !price || !open_hour || !close_hour || !owner_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate categories - must have at least one
    if (!categories || categories === 'undefined') {
      return res.status(400).json({ error: 'Please select at least one category' });
    }

    let categoryIds;
    try {
      categoryIds = JSON.parse(categories);
      if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.status(400).json({ error: 'Please select at least one category' });
      }
    } catch (parseErr) {
      return res.status(400).json({ error: 'Invalid categories format' });
    }

    // Validate capacity and price
    if (isNaN(capacity) || capacity <= 0) {
      return res.status(400).json({ error: 'Capacity must be a positive number' });
    }

    if (isNaN(price) || price < 0) {
      return res.status(400).json({ error: 'Price must be a non-negative number' });
    }

    // Get the primary category name to use as type
    const primaryCategory = await Category.findByPk(categoryIds[0]);
    const type = primaryCategory ? primaryCategory.name : 'venue';

    // Create the hall listing - set type from primary category
    const newListing = await Hall.create({
      name,
      type: type, // Use primary category as type
      description,
      location,
      capacity: parseInt(capacity),
      price: parseFloat(price),
      open_hour,
      close_hour,
      owner_id: parseInt(owner_id)
    });

    console.log('Created hall:', newListing);

    // Handle categories
    const categoryRecords = categoryIds.map(categoryId => ({
      hall_id: newListing.hall_id,
      category_id: parseInt(categoryId),
      created_at: new Date(),
      updated_at: new Date()
    }));
    await HallCategory.bulkCreate(categoryRecords);
    console.log('Created categories:', categoryRecords);

    // Handle image uploads if provided
    if (req.files && req.files.length > 0) {
      const imageRecords = req.files.map((file, index) => ({
        hall_id: newListing.hall_id,
        url: file.path,
        order: index + 1,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await Image.bulkCreate(imageRecords);
      console.log('Created images:', imageRecords);
    }

    res.status(201).json({
      message: 'New venue created successfully!',
      listing: {
        id: newListing.hall_id,
        name: newListing.name,
        type: newListing.type,
        description: newListing.description,
        location: newListing.location,
        capacity: newListing.capacity,
        price: newListing.price,
        openHour: newListing.open_hour,
        closeHour: newListing.close_hour,
        ownerId: newListing.owner_id
      }
    });
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ error: 'Failed to create new venue: ' + err.message });
  }
};
// Update a listing
exports.updateListing = async (req, res) => {
  try {
    const { owner_id } = req.query;
    const {
      name,
      type,
      description,
      location,
      capacity,
      price,
      open_hour,
      close_hour,
      categories
    } = req.body;

    // Find the existing listing
    const existingListing = await Hall.findOne({
      where: { 
        hall_id: req.params.id,
        owner_id
      }
    });

    if (!existingListing) {
      return res.status(404).json({ error: 'Listing not found or you do not have permission to update it' });
    }

    // Update the hall data
    const updateData = {
      name,
      type,
      description,
      location,
      capacity: parseInt(capacity),
      price: parseFloat(price),
      open_hour,
      close_hour
    };

    await Hall.update(updateData, {
      where: { hall_id: req.params.id }
    });

    // Handle categories update
    if (categories && categories !== 'undefined') {
      try {
        const categoryIds = JSON.parse(categories);
        
        // Remove existing categories
        await HallCategory.destroy({
          where: { hall_id: req.params.id }
        });

        // Add new categories
        if (Array.isArray(categoryIds) && categoryIds.length > 0) {
          const categoryRecords = categoryIds.map(categoryId => ({
            hall_id: parseInt(req.params.id),
            category_id: parseInt(categoryId),
            created_at: new Date(),
            updated_at: new Date()
          }));
          await HallCategory.bulkCreate(categoryRecords);
        }
      } catch (parseErr) {
        console.error('Error parsing categories:', parseErr);
      }
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      // Get the current highest order number
      const lastImage = await Image.findOne({
        where: { hall_id: req.params.id },
        order: [['order', 'DESC']]
      });

      const startOrder = lastImage ? lastImage.order + 1 : 1;

      const imageRecords = req.files.map((file, index) => ({
        hall_id: parseInt(req.params.id),
        url: file.path,
        order: startOrder + index,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await Image.bulkCreate(imageRecords);
    }

    const updatedListing = await Hall.findByPk(req.params.id);
    
    res.json({
      message: 'Hall listing updated successfully!',
      listing: {
        id: updatedListing.hall_id,
        name: updatedListing.name,
        type: updatedListing.type,
        description: updatedListing.description,
        location: updatedListing.location,
        capacity: updatedListing.capacity,
        price: updatedListing.price,
        openHour: updatedListing.open_hour,
        closeHour: updatedListing.close_hour
      }
    });
  } catch (err) {
    console.error('Error updating listing:', err);
    res.status(500).json({ error: 'Failed to update hall listing' });
  }
};

// Delete a listing
exports.deleteListing = async (req, res) => {
  try {
    const { owner_id } = req.query;
    
    // Find the listing with its images
    const listing = await Hall.findOne({
      where: { 
        hall_id: req.params.id,
        owner_id
      },
      include: [
        { model: Image, as: 'images', attributes: ['url'] }
      ]
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found or you do not have permission to delete it' });
    }

    // Delete associated image files
    if (listing.images && listing.images.length > 0) {
      listing.images.forEach(image => {
        const filePath = path.join(__dirname, '..', image.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Delete the hall (cascade will handle images and categories)
    const deleted = await Hall.destroy({
      where: { 
        hall_id: req.params.id,
        owner_id
      }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Failed to delete listing' });
    }

    res.json({ 
      message: 'Hall listing deleted successfully!',
      deletedId: req.params.id 
    });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ error: 'Failed to delete hall listing' });
  }
};