// MyContext.js
import React, { createContext, useState } from 'react';

// Create a context with a default value (in this case, an empty object)
const MyContext = createContext({});

// Create a provider component
const MyContextProvider = ({ children }) => {
  const [state, setState] = useState({
    // Your initial state goes here
    data: null,
    // Add any other state properties you need
  });

  const updateState = newData => {
    // Update state logic goes here
    setState(prevState => ({
      ...prevState,
      data: newData,
      // Add other state updates as needed
    }));
  };

  const updateDictionarySearchData = (data) => {
    setState(prevState => ({
      ...prevState,
      dictionarySearch: data
    }))
  }

  // Provide the context value to its children
  const contextValue = {
    state,
    updateState,
    updateDictionarySearchData,
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
