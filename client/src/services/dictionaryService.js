const BASE_URL = 'http://localhost:3500/dictionary';

class DictionaryService {
  async getDictionaryItems(searchStr) {
    try {
      const response = await fetch(`${BASE_URL}/${searchStr}`);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(`Error fetching:`, error);
      throw error;
    }
  }
}

export default new DictionaryService();