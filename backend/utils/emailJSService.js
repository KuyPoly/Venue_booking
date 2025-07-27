// Backend EmailJS Service (Alternative Implementation)
// This is a backup service in case frontend EmailJS has issues

const https = require('https');
const querystring = require('querystring');

const EMAILJS_CONFIG = {
  serviceId: 'service_jwiykgs',
  templateId: 'template_qlsbh93',
  publicKey: 'xVwFze44uJ1H5_MZR'
};

/**
 * Send email notification via EmailJS REST API
 * @param {Object} templateParams - Email template parameters
 * @returns {Promise}
 */
const sendEmailViaAPI = (templateParams) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      service_id: EMAILJS_CONFIG.serviceId,
      template_id: EMAILJS_CONFIG.templateId,
      user_id: EMAILJS_CONFIG.publicKey,
      template_params: templateParams
    });

    const options = {
      hostname: 'api.emailjs.com',
      port: 443,
      path: '/api/v1.0/email/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('Email sent successfully via backend API');
          resolve(responseData);
        } else {
          console.error('Email sending failed:', res.statusCode, responseData);
          reject(new Error(`Email sending failed: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Email API request error:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

/**
 * Send venue addition notification email
 * @param {Object} venueData - Venue information
 * @param {Object} ownerData - Owner information
 */
const sendVenueAddedNotification = async (venueData, ownerData) => {
  try {
    const templateParams = {
      to_name: `${ownerData.first_name} ${ownerData.last_name}`,
      to_email: ownerData.email,
      venue_name: venueData.name,
      venue_location: venueData.location,
      venue_capacity: venueData.capacity,
      venue_price: venueData.price,
      venue_description: venueData.description,
      venue_hours: `${venueData.open_hour} - ${venueData.close_hour}`,
      owner_name: `${ownerData.first_name} ${ownerData.last_name}`,
      submission_date: new Date().toLocaleDateString(),
      submission_time: new Date().toLocaleTimeString()
    };

    console.log('Sending venue addition email:', templateParams);
    await sendEmailViaAPI(templateParams);
    return { success: true };
  } catch (error) {
    console.error('Failed to send venue addition email:', error);
    throw error;
  }
};

module.exports = {
  sendVenueAddedNotification,
  sendEmailViaAPI
};