import { useCallback, useState } from 'react';
import { Input, Button, Row, Col, List } from 'antd';
import aiService from '../../services/aiService';
import useAsync from '../../hooks/useAsync';

const { TextArea } = Input;

const AiPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const startChatbotCallback = useCallback(async () => {
    const { reply } = await aiService.startChatbot();
    setMessages([...messages, { sender: 'bot', text: reply }])
  }, [])

  const { loading: startLoader } = useAsync({
    asyncFunction: startChatbotCallback,
    exitFunction: aiService.endChatbot,
    immediate: true
  })

  const { data: chatData, loading: chatLoader, fetchData: fetchNewReply } = useAsync({
    asyncFunction: aiService.sendMessage
  })

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    // Add user message to the chat
    const userMessage = { sender: 'user', text: inputText };

    const { reply } = await fetchNewReply({ message: userMessage.text });

    // Clear input field after sending message
    setInputText('');

    // Queue up both messages for updating state

    console.log(chatData);
    setMessages(prevMessages => [...prevMessages, userMessage, { sender: 'bot', text: reply }]);

  };

  return (
    <div style={{ padding: '20px', height: 'calc(100vh - 120px)', overflowY: 'scroll', display: 'flex', flexDirection: 'column', background: '#f0f2f5' }}>
      <div style={{ paddingBottom: '20px', flex: 1 }}>
        <List
          dataSource={messages}
          renderItem={(message, index) => (
            <List.Item style={{ textAlign: message.sender === 'user' ? 'right' : 'left', marginBottom: '10px', justifyContent: message.sender === 'user' ? 'flex-start' : 'flex-end' }}>
              <div style={{ padding: '10px', borderRadius: '8px', background: message.sender === 'user' ? '#1890ff' : '#fff', color: message.sender === 'user' ? '#fff' : '#000' }}>
                {message.text}
              </div>
            </List.Item>
          )}
        />
      </div>
      <Row gutter={[16, 16]}>
        <Col span={18}>
          <TextArea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onPressEnter={handleSendMessage}
            disabled={!!startLoader || !!chatLoader}
            placeholder="Type your message..."
            style={{ borderRadius: '20px' }}
          />
        </Col>
        <Col span={6}>
          <Button type="primary" onClick={handleSendMessage} disabled={!!startLoader || !!chatLoader} style={{ borderRadius: '20px', width: '100%' }}>{!!startLoader || !!chatLoader ? 'Loading...' : 'Send'}</Button>
        </Col>
      </Row>
    </div>
  );
};

export default AiPage;
