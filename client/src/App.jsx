import { useContext, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Menu, Button, Modal, Form, Input } from 'antd';
import {
  SearchOutlined,
  AppstoreOutlined,
  BookOutlined,
  RobotOutlined,
  PlusOutlined,
  FormOutlined
} from '@ant-design/icons';
import Dictionary from './components/Dictionary/Dictionary';
import { MyContext } from './context/Context';
import cardService from './services/cardService';
import FlashcardPage from './pages/FlashcardPage';
import AiPage from './pages/AiPage';
import TranscribePage from './pages/TranscribePage';

const { Header, Content, Footer } = Layout;
const { Item } = Form;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { state } = useContext(MyContext);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAdd = async (values) => {
    // Handle the form submission logic here

    console.log('Form values:', values);
    // Close the modal
    const result = await cardService.createCard(values);
    console.log(result);
    setIsModalVisible(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Handle file selection logic here if needed
    uploadFile(file); // Call uploadFile function with the selected file
  };

  const uploadFile = async (file) => {
    // Implement file upload logic here using the 'file' parameter
    console.log('Uploading file:', file);
    // Additional logic as needed
    if (!file) {
      alert('Please select an Anki file.');
      return;
    }

    const formData = new FormData();
    formData.append('jsonFile', file);

    try {
      const response = await fetch('http://localhost:3500/card/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        setModifiedData(jsonResponse.modifiedAnkiData);
      } else {
        console.error('Error uploading Anki file:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const LoginPage = () => <div>Login Page</div>;

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Header Section */}
        <Header style={{ background: '#fff', textAlign: 'center', padding: '10px 0' }}>
          <h1 style={{ margin: 0, color: '#1890ff' }}>Hansou</h1>
        </Header>

        {/* Middle Section - Flashcards */}
        <Content style={{ padding: '24px', background: '#fff', minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Your Flashcards Component Goes Here */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/flashcards" element={isLoggedIn ? <FlashcardPage /> : <Navigate replace to="/login" />} />
            <Route path="/dictionary" element={isLoggedIn ? <Dictionary /> : <Navigate replace to="/login" />} />
            <Route path="/ai" element={isLoggedIn ? <AiPage /> : <Navigate replace to="/login" />} />
            <Route path="/transcribe" element={isLoggedIn ? <TranscribePage /> : <Navigate replace to="/login" />} />
            <Route path="/" element={isLoggedIn ? <Navigate replace to="/flashcards" /> : <Navigate replace to="/login" />} />
          </Routes>
          <div>
            {/* Example placeholder text */}
          </div>
        </Content>

        {/* Bottom Navigation Section */}
        <Footer style={{ textAlign: 'center' }}>
          <Menu mode="horizontal">
            <Menu.Item key="login" icon={<SearchOutlined />}>
              <Link to="/login">Sign In</Link>
            </Menu.Item>
            <Menu.Item key="flashcards" icon={<AppstoreOutlined />}>
              <Link to="/flashcards">Flashcards</Link>
            </Menu.Item>
            <Menu.Item key="dictionary" icon={<BookOutlined />}>
              <Link to="/dictionary">Dictionary</Link>
            </Menu.Item>
            <Menu.Item key="ai" icon={<RobotOutlined />}>
              <Link to="/ai">AI</Link>
            </Menu.Item>
            <Menu.Item key="transcribe" icon={<FormOutlined />}>
              <Link to="/transcribe">Transcribe</Link>
            </Menu.Item>
            <Menu.Item key="add" icon={<PlusOutlined />} onClick={showModal}>
              Add
            </Menu.Item>
          </Menu>
        </Footer>

        {/* Add Modal */}
        <Modal
          title="Add Item"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form onFinish={handleAdd}>
            <Item
              label="Chinese"
              name="han"
              rules={[{ required: true, message: 'Please enter the Chinese name' }]}
            >
              <Input />
            </Item>
            <Item
              label="Pinyin"
              name="pinyin"
              rules={[{ required: true, message: 'Please enter the Pinyin name' }]}
            >
              <Input />
            </Item>
            <Item
              label="English"
              name="eng"
              rules={[{ required: true, message: 'Please enter the English name' }]}
            >
              <Input />
            </Item>
            <Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </Item>
          </Form>
        </Modal>

      </Layout>
    </>
  );
}

export default App;