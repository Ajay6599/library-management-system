import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const BookContext = createContext();

export const BookContextProvider = ({ children }) => {

    const booksCategory = ["Fiction", "Mystery", "Religious", "Romance", "Science Fiction"];

    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAllBooks = async () => {
        setIsLoading(true);

        try {
            // const res = await axios.get(`http://localhost:8080/books/`);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/books/`);
            const data = res.data.avlBooks;
            setBooks(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBooks();
    }, []);

    return (
        <BookContext.Provider value={{books, setBooks, fetchAllBooks, booksCategory, isLoading, setIsLoading}}>
            {children}
        </BookContext.Provider>
    );
};