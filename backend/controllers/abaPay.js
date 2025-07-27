// Call backend endpoint to generate ABA QR
export const generateABAQR = async ({ amount }) => {
  try {
    // Call your backend API instead of ABA directly from frontend
    const endpoint = '/api/payment/aba-qr'; // Example backend endpoint
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate QR code.');
    }
    const data = await response.json();
    if (data.qr_url) {
      return { qr: data.qr_url };
    } else if (data.qr_base64) {
      return { qr: `data:image/png;base64,${data.qr_base64}` };
    } else {
      throw new Error('QR code not found in response.');
    }
  } catch (err) {
    throw err;
  }
};
