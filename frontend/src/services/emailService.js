import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

/**
 * Send email notification when a new hall/venue is successfully added
 * @param {Object} venueData - The venue data
 * @param {Object} ownerData - The owner data
 * @returns {Promise} - EmailJS promise
 */
export const sendHallAddedNotification = async (venueData, ownerData) => {
  try {
    const templateParams = {
      // Template expects {{email}} for "To Email" field
      email: ownerData.email,
      // Template expects {{name}} for the greeting
      name: `${ownerData.first_name} ${ownerData.last_name}`,
      // Template expects hall_ prefixed variables
      hall_name: venueData.name,
      hall_location: venueData.location,
      hall_capacity: venueData.capacity,
      hall_price: venueData.price
    };

    console.log('Sending email notification for venue:', venueData.name);

    const response = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ADD_HALL_ID,
      templateParams
    );

    console.log('Email sent successfully');
    return response;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
};
