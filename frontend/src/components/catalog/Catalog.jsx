import { Box, Checkbox, Flex, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import { Header } from "../header/Header";
import { ButtonComp } from "../button/ButtonComp";
import catalogStyle from "./Catalog.module.css";
import { useEffect, useState } from "react";
import { GiReturnArrow } from "react-icons/gi";
import axios from "axios";

export const Catalog = () => {

    let [borrowedBooks, setBorrowedBooks] = useState([]);

    let [activeSection, setActiveSection] = useState('Borrow');

    const btnHandler = (action) => {
        if (activeSection !== action) {
            setActiveSection(action);
        }
    };

    let tableHead = ['Id', 'Name', 'Email', 'Borrow Date', 'Due Date', 'Return'];

    const [returnStatus, setReturnStatus] = useState({});

    let toast = useToast();

    // Return Book API Hit

    const onReturn = async (book_Id, userEmail) => {
        // console.log(book_Id);

        let token = localStorage.getItem('authToken');

        try {
            // let res = await axios.put(`http://localhost:8080/borrows/returnBook/${book_Id}`, { userEmail, isReturn: !returnStatus[book_Id] }, {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // });

            let res = await axios.put(`${process.env.REACT_APP_API_URL}/borrows/returnBook/${book_Id}`, { userEmail, isReturn: !returnStatus[book_Id] }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // console.log(res.data);

            setReturnStatus(prev => ({
                ...prev,
                [book_Id]: !prev[book_Id]
            }));

            // Show appropriate message based on response
            toast({
                title: 'Return Book',
                description: res?.message,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

        } catch (error) {
            // console.error("Error in API call:", error);

            // Handling different types of errors
            let errorMessage = 'Something went wrong';
            let status = 'error';

            if (error.response) {
                // If error has a response (status code outside the 2xx range)
                if (error.response.status === 400) {
                    errorMessage = error.response?.data?.message || 'Bad Request';
                } else if (error.response.status === 404) {
                    errorMessage = 'Book not found or already returned';
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error, please try again later';
                } else {
                    errorMessage = error.response?.data?.msg || 'Unexpected error occurred';
                }
            } else if (error.request) {
                // If no response was received (could be network issues)
                errorMessage = 'No response from the server. Please check your network connection.';
            } else {
                // If there was an issue setting up the request
                errorMessage = 'Error setting up the request: ' + error.message;
            }

            toast({
                title: 'Error!',
                description: errorMessage,
                status: status,
                duration: 5000,
                isClosable: true,
            })
        }
    };

    let [overdueBooks, setOverdueBooks] = useState([]);

    useEffect(() => {
        const fetchBorrowBook = async () => {

            let token = localStorage.getItem("authToken");

            try {

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

                setBorrowedBooks(res.data.borrowedBooks);
            } catch (error) {
                console.log(error);
            }
        };

        fetchBorrowBook();
    }, []);

    useEffect(() => {
        setOverdueBooks(borrowedBooks.filter(overdueDate => new Date(overdueDate.dueDate).toLocaleString() < new Date().toLocaleString() && overdueDate.returnDate === null));
    }, [borrowedBooks]);

    // console.log('OB-> ', borrowedBooks.filter(overdueDate => new Date(overdueDate.dueDate).toLocaleString() < new Date().toLocaleString() && overdueDate.returnDate === null));

    return (
        <Stack
            // border='1px solid teal'
            ml={['0px', '0px', '220px', '220px']}
            pos='relative'
        >
            <Header />

            <Flex
                // border='1px solid yellow'
                flexDir='column'
                gap='1rem'
                m='4rem 0.5rem 0'
            >

                <Flex
                    // border='1px solid red'
                    flexDir='row'
                    alignItems='start'
                    gap='0.75rem'
                    className={catalogStyle.btnContainer}
                >
                    <Box
                        bgColor={activeSection === 'Borrow' ? '#000' : '#e8e8e8'}
                        color={activeSection === 'Borrow' ? '#fff' : '#000'}
                        rounded='6px'
                    >
                        <ButtonComp
                            text='Borrowed Books'
                            clickHandler={() => btnHandler('Borrow')}
                        />
                    </Box>

                    <Box
                        bgColor={activeSection === 'Overdue' ? '#000' : '#e8e8e8'}
                        color={activeSection === 'Overdue' ? '#fff' : '#000'}
                        rounded='6px'
                    >
                        <ButtonComp
                            text='Overdue Borrowers'
                            clickHandler={() => btnHandler('Overdue')}
                        />
                    </Box>
                </Flex>

                <Flex>
                    {
                        activeSection === 'Borrow' ? (
                            borrowedBooks.length === 0 ? (
                                <Text>No Borrowed Books</Text>
                            ) : (
                                <Box
                                    // border='1px solid green'
                                    w='100%'
                                    h='79vh'
                                    overflow='auto'
                                    css={{
                                        "&::-webkit-scrollbar": {
                                            width: "6px",
                                            height: "4px",
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            backgroundColor: "#101010",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                        },
                                    }}
                                >
                                    <Table
                                        variant='striped'
                                        colorScheme="white"
                                    >
                                        <Thead
                                            backgroundColor='#101010'
                                            pos='sticky'
                                            top='0'
                                            zIndex='100'
                                        >
                                            <Tr>
                                                {
                                                    tableHead.map((head, idx) => (
                                                        <Th
                                                            key={idx}
                                                            color='yellow'
                                                            fontWeight='500'
                                                            textAlign='center'
                                                        >
                                                            {head}
                                                        </Th>
                                                    ))
                                                }
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {
                                                borrowedBooks.map(({ user, book, borrowDate, dueDate, returnDate }, idx) => (
                                                    <Tr
                                                        key={idx}
                                                        cursor='pointer'
                                                        _hover={{
                                                            backgroundColor: '#101010',
                                                            color: '#fff',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Td textAlign='center'>{idx + 1}.</Td>
                                                        <Td textAlign='center'>{user.name}</Td>
                                                        <Td textAlign='center'>{user.email}</Td>
                                                        <Td textAlign='center'>
                                                            {(
                                                                () => {
                                                                    let bd = new Date(borrowDate);
                                                                    return bd.toLocaleDateString('en-GB');
                                                                }
                                                            )()}
                                                        </Td>
                                                        <Td textAlign='center'>
                                                            {(
                                                                () => {
                                                                    let rd = new Date(dueDate);
                                                                    return rd.toLocaleDateString('en-GB');
                                                                }
                                                            )()}
                                                        </Td>
                                                        <Td textAlign='center'>
                                                            <Box
                                                                // border='1px solid red'
                                                                display='flex'
                                                                justifyContent='center'
                                                                className={catalogStyle.catalogBtnHandler}
                                                            >
                                                                {
                                                                    returnDate ? (
                                                                        <Checkbox isChecked></Checkbox>
                                                                    ) : returnStatus[book._id] ? (
                                                                        <Checkbox
                                                                            isChecked={true}
                                                                            onChange={() => onReturn(book._id, user.email)}
                                                                        ></Checkbox>
                                                                    ) : (
                                                                        <ButtonComp
                                                                            icon={<GiReturnArrow />}
                                                                            clickHandler={() => onReturn(book._id, user.email)}
                                                                        />
                                                                    )
                                                                }
                                                            </Box>
                                                        </Td>
                                                    </Tr>
                                                ))
                                            }
                                        </Tbody>
                                    </Table>
                                </Box>
                            )
                        ) : activeSection === 'Overdue' ? (
                            overdueBooks.length === 0 ? (
                                <Text>No Overdue Borrowers</Text>
                            ) : (
                                <Box
                                    // border='1px solid green'
                                    w='100%'
                                    h='79vh'
                                    overflow='auto'
                                    css={{
                                        "&::-webkit-scrollbar": {
                                            width: "6px",
                                            height: "4px",
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            backgroundColor: "#101010",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                        },
                                    }}
                                >
                                    <Table
                                        variant='striped'
                                        colorScheme="white"
                                    >
                                        <Thead
                                            backgroundColor='#101010'
                                            pos='sticky'
                                            top='0'
                                            zIndex='100'
                                        >
                                            <Tr>
                                                {
                                                    tableHead.map((head, idx) => (
                                                        <Th
                                                            key={idx}
                                                            color='yellow'
                                                            fontWeight='500'
                                                            textAlign='center'
                                                        >
                                                            {head}
                                                        </Th>
                                                    ))
                                                }
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {
                                                overdueBooks.map(({ user, book, borrowDate, dueDate, returnDate }, idx) => (
                                                    <Tr
                                                        key={idx}
                                                        cursor='pointer'
                                                        _hover={{
                                                            backgroundColor: '#101010',
                                                            color: '#fff',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Td textAlign='center'>{idx + 1}.</Td>
                                                        <Td textAlign='center'>{user.name}</Td>
                                                        <Td textAlign='center'>{user.email}</Td>
                                                        <Td textAlign='center'>
                                                            {(
                                                                () => {
                                                                    let bd = new Date(borrowDate);
                                                                    return bd.toLocaleDateString('en-GB');
                                                                }
                                                            )()}
                                                        </Td>
                                                        <Td textAlign='center'>
                                                            {(
                                                                () => {
                                                                    let rd = new Date(dueDate);
                                                                    return rd.toLocaleDateString('en-GB');
                                                                }
                                                            )()}
                                                        </Td>
                                                        <Td textAlign='center'>
                                                            <Box
                                                                // border='1px solid red'
                                                                display='flex'
                                                                justifyContent='center'
                                                                className={catalogStyle.catalogBtnHandler}
                                                            >
                                                                {
                                                                    returnDate ? (
                                                                        <Checkbox isChecked></Checkbox>
                                                                    ) : returnStatus[book._id] ? (
                                                                        <Checkbox
                                                                            isChecked={true}
                                                                            onChange={() => onReturn(book._id, user.email)}
                                                                        ></Checkbox>
                                                                    ) : (
                                                                        <ButtonComp
                                                                            icon={<GiReturnArrow />}
                                                                            clickHandler={() => onReturn(book._id, user.email)}
                                                                        />
                                                                    )
                                                                }
                                                            </Box>
                                                        </Td>
                                                    </Tr>
                                                ))
                                            }
                                        </Tbody>
                                    </Table>
                                </Box>
                            )
                        ) : (
                            <Text>Select a section</Text>
                        )
                    }
                </Flex>

            </Flex>
        </Stack>
    );
};
