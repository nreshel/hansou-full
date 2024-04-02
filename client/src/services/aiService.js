const BASE_URL = 'http://localhost:3500/chatBot';

class AiSerivce {
  async startChatbot() {
    try {
      const response = await fetch(`${BASE_URL}/start`);
      const result = await response.json();
      return result;
    } catch(error) {
      console.error('Error creating data:', error);
      throw error;
    }
  }
  async endChatbot() {
    try {
      const response = await fetch(`${BASE_URL}/end`);
      const result = await response.json();
      return result;
    } catch(error) {
      console.error('Error creating data:', error);
      throw error;
    }
  }

  async sendMessage(data) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch(error) {
      throw error;
    }
  }
}

export default new AiSerivce()