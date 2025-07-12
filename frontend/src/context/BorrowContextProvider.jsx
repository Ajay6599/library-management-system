import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

export const BorrowContext = createContext();

export const BorrowContextProvider = ({ children }) => {

    let initialBorrowState = {
        borrowBooks: [],
        isLoading: true,
        error: null
    };

    const borrowReducer = (state, action) => {
        switch(action.type) {
            case "LOADING": 
                return {
                    ...state,
                    isLoading: true,
                    error: null
                };
            case "FETCH_BOOKS_SUCCESS":
                return {
                    ...state,
                    borrowBooks: action.payLoad,
                    isLoading: false
                };
            case "ERROR":
                return {
                    ...state,
                    isLoading: false,
                    error: action.payLoad
                }
            default:
                return state;
        }
    };

    let [state, dispatch] = useReducer(borrowReducer, initialBorrowState);

    const fetchBorrowBook = async () => {
        dispatch({
            type: 'LOADING'
        });

        let token = localStorage.getItem("authToken");

        try {

            // console.log(token);

            // let res = await axios.get(`http://localhost:8080/borrows/all-borrowed-books`, {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     },
            // });

            let res = await axios.get(`${process.env.REACT_APP_API_URL}/borrows/all-borrowed-books`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            // console.log("fetchBorrrow", res.data.borrowedBooks);

            dispatch({
                type: "FETCH_BOOKS_SUCCESS",
                payLoad: res.data.borrowedBooks
            })

        } catch (error) {
            // console.log(error);
            dispatch({
                type: "FETCH_BOOKS_ERROR",
                payload: error.message || "Failed to fetch books",
            });
        }
    };

    useEffect(() => {
        fetchBorrowBook();
    }, []);

    return (
        <BorrowContext.Provider value={{ ...state }}>
            {children}
        </BorrowContext.Provider>
    );
};