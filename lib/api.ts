const API_BASE_URL = 'http://localhost:8000';

export interface User {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  is_seller: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  seller_id: number;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_time: number;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  getBaseUrl() {
    return API_BASE_URL;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    try {
      // Check if the backend is accessible before making the request
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout. Server may be down.')), 10000)
      );
      
      const fetchPromise = fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
      
      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (!response.ok) {
        // Handle 401 Unauthorized specifically
        if (response.status === 401) {
          console.error('Authentication token expired or invalid');
          // Clear the invalid token
          this.token = null;
          localStorage.removeItem("hanythrift_token");
          localStorage.removeItem("hanythrift_user");
          
          // Dispatch an event that can be caught by the auth provider
          window.dispatchEvent(new CustomEvent('auth:expired'));
          
          throw new Error('Authentication failed. Please log in again.');
        }
        
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || `API error: ${response.statusText}`;
        } catch (e) {
          errorMessage = `API error: ${response.statusText || errorText}`;
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      // Enhanced error handling
      let errorMessage = 'Unknown API error occurred';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error: Could not connect to the server. Please check if the backend is running.';
        console.error('Network error:', error);
      } else if (error instanceof Error) {
        errorMessage = error.message;
        console.error('API request failed:', error);
      }
      
      // Create a custom error that contains both the message for display and the original error
      const customError = new Error(errorMessage);
      (customError as any).originalError = error;
      
      throw customError;
    }
  }

  // Auth
  async login(email: string, password: string) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    return response.json();
  }

  // Products
  async getProducts() {
    return this.fetchWithAuth('/products/');
  }

  async getProduct(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async createProduct(product: Omit<Product, 'id' | 'seller_id'>) {
    return this.fetchWithAuth('/products/', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  // Cart
  async getCart() {
    try {
      const response = await this.fetchWithAuth('/cart/');
      return response;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  async addToCart(productId: number, quantity: number) {
    try {
      if (!this.token) {
        throw new Error('Authentication failed. Please log in again.');
      }

      const response = await this.fetchWithAuth('/cart/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity }),
      });
      return response;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async updateCartItem(cartItemId: number, quantity: number) {
    return this.fetchWithAuth(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(cartItemId: number) {
    return this.fetchWithAuth(`/cart/${cartItemId}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders() {
    return this.fetchWithAuth('/orders/');
  }

  async createOrder(order: {
    total_amount: number;
    items: { product_id: number; quantity: number }[];
  }) {
    return this.fetchWithAuth('/orders/', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  // Token refresh
  async refreshToken(refreshToken: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      this.setToken(data.access_token);
      return data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
}

export const api = new ApiClient(); 