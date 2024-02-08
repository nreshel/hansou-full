import React, { useCallback, useEffect, useState } from 'react'
import { Button, Row, Col } from 'antd';
import {
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import useAsync from '../../hooks/useAsync';
import cardService from '../../services/cardService';
import Flashcard from '../../components/Flashcard/Flashcard';

const FlashcardPage = () => {
  
  const { data: cards, setData } = useAsync({
    asyncFunction: cardService.getCards,
    immediate: true
  })
  const [currentCard, setCurrentCard] = useState(null)
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  useEffect(() => {
    console.log("I am getting rendered", cards?.activeCards, cards?.activeCards[currentCardIndex], currentCardIndex);
    setCurrentCard(cards?.activeCards[currentCardIndex])
  }, [cards, currentCardIndex])

  console.log(cards);
  const activeCardCount = cards?.activeCards?.length; // Replace with the actual count of active cards
  const inactiveCardCount = cards?.inactiveCards?.length;



  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards?.activeCards?.length);

  };

  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards?.activeCards?.length) % cards?.activeCards?.length);
  };

  console.log("this is the current card", currentCard);
  return (
    <Row style={{ alignItems: 'center', justifyContent: 'center' }} className="here">
    {/* Next and Previous Buttons */}
      <Col span={24} style={{ marginBottom: '10px', textAlign: 'center' }}>
        <h3>Active Cards: {activeCardCount}</h3>
      </Col>

      {/* Flashcard Component */}
      <Col xs={24} sm={12} md={8} lg={6}>
        <Flashcard 
          han={currentCard?.han} 
          pinyin={currentCard?.pinyin} 
          eng={currentCard?.eng} 
          onDone={async () => {
            const newTimestamp = new Date();
            newTimestamp.setDate(newTimestamp.getDate() + currentCard.done + 1);
            await cardService.updateCard({
              ...currentCard,
              done: currentCard.done + 1,
              timestamp: newTimestamp
            })
            let updatedActiveCards = cards.activeCards;
            let updateInactiveCards = cards.inactiveCards;
            let removedElem = updatedActiveCards.splice(currentCardIndex, 1)
            removedElem = {
              ...removedElem,
              done: currentCard.done + 1,
              timestamp: newTimestamp
            };
            updateInactiveCards = [...updateInactiveCards, removedElem];
            console.log("index before", currentCardIndex);
            currentCardIndex === cards.activeCards.length ? setCurrentCardIndex(prevState => prevState - 1) : null;
            console.log("index after", currentCardIndex);
            setData(prevState => ({
              ...prevState,
              activeCards: updatedActiveCards,
              inactiveCards: updateInactiveCards
            }))
          }}
          onReset={async () => {
            console.log({
              ...currentCard,
              done: 0
            })
            await cardService.updateCard({
              ...currentCard,
              done: 0
            })
            let updatedActiveCards = cards.activeCards;
            updatedActiveCards[currentCardIndex] = {
              ...updatedActiveCards[currentCardIndex],
              done: 0
            }

            console.log(updatedActiveCards);
            setData(prevState => ({
              ...prevState,
              activeCards: updatedActiveCards
            }))
          }}
          onDelete={async () => {
            const result = await cardService.deleteCard(currentCard._id);
            let updatedActiveCards = cards.activeCards;
            updatedActiveCards.splice(currentCardIndex, 1);
            setCurrentCard(updatedActiveCards[currentCardIndex]);
            setCurrentCardIndex(prevState => currentCardIndex === 0 ? prevState : prevState - 1);
            setData(prevState => ({
              ...prevState,
              activeCards: updatedActiveCards
            }))
          }}
        />
      </Col>

      {/* Display the number of inactive cards */}
      <Col span={24} style={{ marginTop: '10px', textAlign: 'center' }}>
        <h3>Inactive Cards: {inactiveCardCount}</h3>
      </Col>
      <Col span={24} style={{ marginBottom: '10px', textAlign: 'center' }}>
        <Button className='prev-button' onClick={handlePrevCard} style={{ marginRight: '10px' }}>
          <LeftOutlined /> Previous
        </Button>
        <Button className='next-button' onClick={handleNextCard}>
          Next <RightOutlined />
        </Button>
      </Col>
    </Row>
  )
}

export default FlashcardPage;