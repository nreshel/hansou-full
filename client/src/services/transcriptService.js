const BASE_URL = 'http://localhost:3500/transcript';

class TranscribeService {
  async fetchTranscriptionAndDownload(url) {
    const videoUrl = url;
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrl }), // Replace with the URL of the YouTube video
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch transcription');
      }
  
      const transcription = await response.text();
      console.log('Transcription:', transcription);
  
      // Create a Blob from the transcription text
      const blob = new Blob([transcription], { type: 'text/plain' });
  
      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);
  
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = 'transcription.txt'; // Specify the filename for the downloaded file
      document.body.appendChild(link);
  
      // Trigger the download
      link.click();
  
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error fetching transcription:', error);
    }
  }  
}

export default new TranscribeService()