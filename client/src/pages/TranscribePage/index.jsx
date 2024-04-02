import { useState } from 'react';
import { Input, Button, Row, Col, Card } from 'antd';
import './transcribePage.css'; // Import CSS file for styling
import useAsync from '../../hooks/useAsync';
import transcriptService from '../../services/transcriptService';

const { Meta } = Card;

const TranscribePage = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState('');

  const { fetchData: transcribeVideo } = useAsync({
    asyncFunction: transcriptService.getTranscription
  })

  const handleInputChange = (event) => {
    setVideoUrl(event.target.value);
  };

  const fetchVideoInfo = () => {
    const videoId = extractVideoId(videoUrl);
    if (videoId) {
      setVideoThumbnail(`https://img.youtube.com/vi/${videoId}/0.jpg`);
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
        .then(response => response.json())
        .then(data => {
          setVideoTitle(data.title);
          setVideoDescription(data.description);
        })
        .catch(error => console.error('Error fetching video information:', error));
        transcriptService.fetchTranscriptionAndDownload(videoUrl);
    } else {
      setVideoThumbnail('');
      setVideoTitle('');
      setVideoDescription('');
    }
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    } else {
      console.error('Invalid YouTube URL');
      return null;
    }
  };

  return (
    <div className="transcribe-container">
      <Row justify="center">
        {/* Input field for entering YouTube video URL */}
        <Col span={24} className="input-col">
          <Input
            placeholder="Enter YouTube video URL"
            value={videoUrl}
            onChange={handleInputChange}
          />
          <Button onClick={fetchVideoInfo}>Fetch</Button>
        </Col>

        {/* Display video title, description, and thumbnail if available */}
        {videoThumbnail && (
          <Col span={24} className="output-col">
            <Card
              style={{ width: '100%' }}
              cover={<img alt="Video Thumbnail" src={videoThumbnail} />}
            >
              <Meta
                title={<h2>{videoTitle}</h2>}
                description={<p>{videoDescription}</p>}
              />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default TranscribePage;
