import React, { useContext, useState } from 'react';
import { Input, Row, Col, Card } from 'antd';
import Flashcard from '../Flashcard/Flashcard';
import dictionaryService from '../../services/dictionaryService';
import { MyContext } from '../../context/Context';
const { Search } = Input;

const Dictionary = () => {
  const { state, updateDictionarySearchData } = useContext(MyContext);
  const [searchText, setSearchText] = useState('');

  // Placeholder flashcard data (replace with actual data)
  const flashcardsData = state?.dictionarySearch?.result ?? [];

  console.log(flashcardsData);
  // Filter flashcards based on search text
  // const filteredFlashcards = flashcardsData.filter(
  //   (flashcard) =>
  //     flashcard.chinese.toLowerCase().includes(searchText.toLowerCase()) ||
  //     flashcard.pinyin.toLowerCase().includes(searchText.toLowerCase()) ||
  //     flashcard.english.toLowerCase().includes(searchText.toLowerCase())
  // );

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    console.log(e.target.value);
    // if (e.key === 'Enter') {
    //   console.log("this is happening");
    //   // Execute your desired action when Enter key is pressed
    //   // await dictionaryService.getDictionaryItems(searchText);
    // }
  }

  const handleEnter = async (e) => {
    if(e.key === 'Enter') {
      updateDictionarySearchData(
        await dictionaryService.getDictionaryItems(searchText)
      );
    }
  }

  return (
    <div>
      {/* Search Bar */}
      <Search
        placeholder="Search flashcards..."
        onChange={(e) => handleSearch(e)}
        onPressEnter={(e) => handleEnter(e)}
        style={{ marginBottom: '16px' }}
      />

      {/* Flashcard List */}
      <Row gutter={[16, 16]}>
        {flashcardsData.map((flashcard, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Flashcard
              han={flashcard.han}
              pinyin={flashcard.pinyin}
              eng={flashcard.eng}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dictionary;
