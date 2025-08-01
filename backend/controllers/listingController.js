const { Hall, Image, Category, HallCategory, User } = require('../model/Association');
const { sendVenueAddedNotification } = require('../utils/emailJSService');
const multer = require('multer');
const { storage, cloudinary } = require('../config/cloudinary');

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
    const owner_id = req.user.user_id; // Get from authenticated user
    const { category } = req.query;
    
    console.log('=== getAllListings Debug ===');
    console.log('Authenticated owner_id:', owner_id);
    console.log('Query params:', req.query);
    
    // First, check if any halls exist for this owner
    const hallCount = await Hall.count({ where: { owner_id } });
    console.log(`📊 Total halls for owner ${owner_id}:`, hallCount);

    const include = [
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
    ];

    // Add category filter if provided
    if (category) {
      include.push({
        model: Category, 
        as: 'categories', 
        where: { name: category },
        through: { attributes: [] }, 
        attributes: ['id', 'name'],
        required: true
      });
    }

    const listings = await Hall.findAll({
      where: { owner_id },
      include,
      order: [['created_at', 'DESC']]
    });

    console.log(`📋 Raw listings found:`, listings.length);
    console.log('First listing:', listings[0] ? {
      id: listings[0].hall_id,
      name: listings[0].name,
      owner_id: listings[0].owner_id
    } : 'None');

    const transformedListings = listings.map(hall => ({
      id: hall.hall_id,
      name: hall.name,
      description: hall.description,
      location: hall.location,
      capacity: hall.capacity,
      price: hall.price,
      openHour: hall.open_hour,
      closeHour: hall.close_hour,
      // Fix image URL generation
      images: hall.images ? hall.images.map(img => 
        img.url // Cloudinary URLs are already complete, no need to modify
      ) : [],
      categories: hall.categories ? hall.categories.map(cat => ({ id: cat.id, name: cat.name })) : [],
      createdAt: hall.created_at,
      updatedAt: hall.updated_at
    }));

    console.log(`✅ Returning ${transformedListings.length} transformed listings`);
    console.log('Response data:', {
      message: `Found ${transformedListings.length} listings for owner ${owner_id}`,
      listings: transformedListings
    });

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
      description: listing.description,
      location: listing.location,
      capacity: listing.capacity,
      price: listing.price,
      openHour: listing.open_hour,
      closeHour: listing.close_hour,
      ownerId: listing.owner_id,
      // Fix image URL generation
      images: listing.images ? listing.images.map(img => 
        img.url // Cloudinary URLs are already complete, no need to modify
      ) : [],
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

    // Add debugging for owner_id
    console.log('Attempting to create venue with owner_id:', owner_id);

    // Validate that owner_id exists in the user table
    const User = require('../model/User');
    const ownerExists = await User.findByPk(parseInt(owner_id));
    
    if (!ownerExists) {
      console.error(`Owner with ID ${owner_id} does not exist in database`);
      return res.status(400).json({ 
        error: `Invalid owner ID. User with ID ${owner_id} does not exist.` 
      });
    }
    
    console.log('Owner found:', {
      id: ownerExists.user_id,
      name: `${ownerExists.first_name} ${ownerExists.last_name}`,
      role: ownerExists.role
    });

    // Validate that the user is an owner
    if (ownerExists.role !== 'owner') {
      return res.status(403).json({ 
        error: 'Only users with owner role can create venues' 
      });
    }

    // Validate required fields
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

    // Create the hall listing without type field
    const newListing = await Hall.create({
      name,
      description,
      location,
      capacity: parseInt(capacity),
      price: parseFloat(price),
      open_hour,
      close_hour,
      owner_id: parseInt(owner_id) // Ensure it's an integer
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
    url: file.path, // Cloudinary returns the full URL in file.path
    order: index + 1,
    created_at: new Date(),
    updated_at: new Date()
  }));

  console.log('Image records to be created:', imageRecords); // Debug log
  await Image.bulkCreate(imageRecords);
  console.log('Created images:', imageRecords);
}

    // Fetch owner information to include in response
    const owner = await User.findByPk(newListing.owner_id, {
      attributes: ['user_id', 'first_name', 'last_name', 'email']
    });

    // Optional: Send email notification from backend (alternative to frontend EmailJS)
    // Uncomment the following lines if you want to send email from backend instead
    /*
    if (owner) {
      try {
        await sendVenueAddedNotification(newListing, owner);
        console.log('Email notification sent successfully from backend');
      } catch (emailError) {
        console.error('Failed to send email from backend:', emailError);
      }
    }
    */

    res.status(201).json({
      message: 'New venue created successfully!',
      listing: {
        id: newListing.hall_id,
        name: newListing.name,
        description: newListing.description,
        location: newListing.location,
        capacity: newListing.capacity,
        price: newListing.price,
        openHour: newListing.open_hour,
        closeHour: newListing.close_hour,
        ownerId: newListing.owner_id
      },
      owner: owner ? {
        id: owner.user_id,
        first_name: owner.first_name,
        last_name: owner.last_name,
        email: owner.email
      } : null
    });
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ error: 'Failed to create new venue: ' + err.message });
  }
};
// Update a listing
exports.updateListing = async (req, res) => {
  try {
    const owner_id = req.user.user_id; // Get from authenticated user
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
  const transaction = await Hall.sequelize.transaction(); // Start a transaction
  
  try {
    const owner_id = req.user.user_id; // Get from authenticated user instead of query
    const listingId = req.params.id;
    
    console.log('=== DELETE LISTING DEBUG ===');
    console.log('Attempting to delete listing:', listingId);
    console.log('Owner ID from auth:', owner_id);
    console.log('Request user:', req.user);
    
    // Find the listing with its images
    const listing = await Hall.findOne({
      where: { 
        hall_id: listingId,
        owner_id
      },
      include: [
        { model: Image, as: 'images', attributes: ['url'] }
      ],
      transaction
    });

    console.log('Found listing:', listing ? 'Yes' : 'No');
    
    if (!listing) {
      await transaction.rollback();
      console.log('Listing not found or permission denied');
      return res.status(404).json({ error: 'Listing not found or you do not have permission to delete it' });
    }

    console.log('Listing details:', { id: listing.hall_id, name: listing.name, owner: listing.owner_id });

    // Step 1: Delete all associated records in the correct order

    // 1. Delete HallReservations first (they depend on both Hall and Booking)
    const { HallReservation, Booking, Payment, HallCategory, Favorite } = require('../model/Association');
    
    console.log('Deleting hall reservations...');
    await HallReservation.destroy({
      where: { hall_id: listingId },
      transaction
    });

    // 2. Delete HallCategory associations (Many-to-Many)
    console.log('Deleting hall categories...');
    await HallCategory.destroy({
      where: { hall_id: listingId },
      transaction
    });

    // 3. Delete Favorites
    console.log('Deleting favorites...');
    await Favorite.destroy({
      where: { hall_id: listingId },
      transaction
    });

    // 4. Delete associated image files from Cloudinary/filesystem
    if (listing.images && listing.images.length > 0) {
      console.log(`Deleting ${listing.images.length} images`);
      for (const image of listing.images) {
        // Check if it's a Cloudinary URL
        if (image.url.includes('cloudinary.com')) {
          try {
            // Extract public_id from Cloudinary URL to delete the image
            const urlParts = image.url.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = `halls/${publicIdWithExtension.split('.')[0]}`; // Remove extension and add folder
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted Cloudinary image: ${publicId}`);
          } catch (err) {
            console.error('Error deleting Cloudinary image:', err);
            // Don't fail the transaction for image deletion errors
          }
        } else {
          // Handle legacy local files (if any exist)
          const path = require('path');
          const fs = require('fs');
          const filePath = path.join(__dirname, '..', image.url);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
              console.log(`Deleted local image: ${filePath}`);
            } catch (err) {
              console.error('Error deleting local image:', err);
              // Don't fail the transaction for image deletion errors
            }
          }
        }
      }
    }

    // 5. Delete Images from database (cascade should handle this, but let's be explicit)
    console.log('Deleting images from database...');
    await Image.destroy({
      where: { hall_id: listingId },
      transaction
    });

    // 6. Finally, delete the hall itself
    console.log('Deleting hall...');
    const deleted = await Hall.destroy({
      where: { 
        hall_id: listingId,
        owner_id
      },
      transaction
    });

    console.log('Deletion result:', deleted);

    if (!deleted) {
      await transaction.rollback();
      console.log('Failed to delete - no rows affected');
      return res.status(404).json({ error: 'Failed to delete listing' });
    }

    // Commit the transaction
    await transaction.commit();
    console.log('✅ Successfully deleted listing and all related records');
    
    res.json({ 
      message: 'Hall listing deleted successfully!',
      deletedId: listingId 
    });
  } catch (err) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    console.error('Error deleting listing:', err);
    res.status(500).json({ 
      error: 'Failed to delete hall listing',
      details: err.message 
    });
  }
};