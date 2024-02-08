// Flashcard.js

import React, { useState } from 'react';
import { Row, Col, Card, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'; // Import the icon
import './Flashcard.css'; // You can create this file for additional styling

const Flashcard = ({ han, pinyin, eng, onDone, onReset, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDone = (event) => {
    // Handle 'Done' button click
    // Add your logic here
    event.stopPropagation();
    onDone();
  };

  const handleReset = (event) => {
    // Handle 'Reset' button click
    // Add your logic here
    event.stopPropagation();
    onReset();
  };

  const handleDelete = (event) => {
    // Handle 'Delete' icon click
    // Add your logic here
    event.stopPropagation();
    // Do something to delete the card
    onDelete();
  };

  return (
    <Card className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
      {!!onDone && <div className="delete-icon"> {/* Add a div for the icon */}
        <DeleteOutlined onClick={handleDelete} /> {/* Add the icon */}
      </div>}
      <div className={`content ${isFlipped ? 'back' : 'front'}`}>
        <p>{isFlipped ? `English: ${eng}` : `${han} - ${pinyin}`}</p>
      </div>
      {isFlipped ? (
        <Row justify="center" gutter={[2, 2]}>
          {!!onReset && <Col> {/* Swap the order of the buttons */}
            <Button className="flip-button" onClick={handleReset}>
              <span className="button-text">Reset</span>
            </Button>
          </Col>}
          {!!onDone && <Col>
            <Button className="flip-button" onClick={handleDone}>
              <span className="button-text">Done</span>
            </Button>
          </Col>}
        </Row>
      ) : (
        <Row justify="center" gutter={[2, 2]}>
          {!!onDone && <Col>
            <Button className="flip-button" onClick={handleDone}>
              <span className="button-text">Done</span>
            </Button>
          </Col>}
          {!!onReset && <Col> {/* Swap the order of the buttons */}
            <Button className="flip-button" onClick={handleReset}>
              <span className="button-text">Reset</span>
            </Button>
          </Col>}
        </Row>
      )}
    </Card>
  );
};

export default Flashcard;
