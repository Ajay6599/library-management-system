import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContextProvider';
import { BookContextProvider } from './context/BookContextProvider';
// import { BorrowContextProvider } from './context/BorrowContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BookContextProvider>
        {/* <BorrowContextProvider> */}
          <BrowserRouter>
            <ChakraProvider>
              <App />
            </ChakraProvider>
          </BrowserRouter>
        {/* </BorrowContextProvider> */}
      </BookContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

reportWebVitals();
