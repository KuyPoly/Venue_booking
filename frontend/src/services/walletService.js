// services/walletService.js
class WalletService {
  constructor() {
    this.baseURL = `${process.env.REACT_APP_API_BASE_URL}/api/wallet`;
  }

  // Get authentication token from localStorage
  getAuthToken() {
    // Try multiple possible token storage keys
    let token = localStorage.getItem('token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('accessToken');
    
    if (!token) {
      console.warn('No authentication token found in localStorage');
      console.log('Available localStorage keys:', Object.keys(localStorage));
    } else {
      console.log('Found token:', token.substring(0, 20) + '...');
    }
    return token;
  }

  // Get request headers with authentication
  getHeaders() {
    const token = this.getAuthToken();
    if (!token) {
      console.error('No authentication token available');
      console.log('Current localStorage contents:', Object.keys(localStorage));
      throw new Error('Authentication required. Please log in.');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    console.log('Request headers prepared:', { ...headers, Authorization: `Bearer ${token.substring(0, 20)}...` });
    return headers;
  }

  // Get wallet information
  async getWalletInfo() {
    try {
      console.log('Fetching wallet info...');
      const headers = this.getHeaders();
      console.log('Headers:', headers);
      
      const response = await fetch(`${this.baseURL}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Wallet info fetch failed:', error);
        throw new Error(error.error || 'Failed to fetch wallet info');
      }

      const data = await response.json();
      console.log('Wallet info received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching wallet info:', error);
      throw error;
    }
  }

  // Get transaction history
  async getTransactionHistory(page = 1, limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/transactions?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch transaction history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  // Withdraw funds
  async withdrawFunds(withdrawalData) {
    try {
      const response = await fetch(`${this.baseURL}/withdraw`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(withdrawalData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process withdrawal');
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      throw error;
    }
  }

  // Get wallet statistics
  async getWalletStats() {
    try {
      const response = await fetch(`${this.baseURL}/stats`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch wallet statistics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching wallet stats:', error);
      throw error;
    }
  }

  // Credit wallet (for testing/admin purposes)
  async creditWallet(creditData) {
    try {
      const response = await fetch(`${this.baseURL}/credit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(creditData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to credit wallet');
      }

      return await response.json();
    } catch (error) {
      console.error('Error crediting wallet:', error);
      throw error;
    }
  }
}

export default new WalletService();
