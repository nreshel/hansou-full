const BASE_URL = 'http://localhost:3500/card';

class CardService {

  async createCard(data) {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating data:', error);
      throw error;
    }
  }

  async getCards() {
    try {
      const response = await fetch(BASE_URL);
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Error getting cards', error);
      throw error
    }
  }

  async updateCard(data) {
    try {
      console.log(data);
      const response = await fetch(BASE_URL, {
        method: "PUT", // specify the request method
        headers: {
          "Content-Type": "application/json" // specify the data format
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Error updating card', data._id)
    }
  }

  async deleteCard(_id) {
    try {
      const response = await fetch(`${BASE_URL}/${_id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log("Error deleting card", _id);
    }
  }

  async read(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error reading data with ID ${id}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error updating data with ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error deleting data with ID ${id}:`, error);
      throw error;
    }
  }

  async list() {
    try {
      const response = await fetch(this.baseURL);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}

export default new CardService();