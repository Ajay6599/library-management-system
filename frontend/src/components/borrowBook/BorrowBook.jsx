import { Box, Flex, Heading, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { ButtonComp } from "../button/ButtonComp";
import borrowBooksStyle from './BorrowBook.module.css';
import { useEffect, useState } from "react";
import { Header } from "../header/Header";
import axios from "axios";

export const BorrowBook = () => {

    let [activeSection, setActiveSection] = useState('Return');

    let tableHead = ['Sr.No.', 'Title', 'Borrow Date', 'Due Date', 'Returned'];

    let [userBookBorrowed, setUserBookBorrowed] = useState([]);

    const fetchBorrowedBooks = async () => {
        let token = localStorage.getItem('authToken');

        try {
            // let res = await axios.get(`http://localhost:8080/borrows/user-borrowed-books`, {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // })

            let res = await axios.get(`${process.env.REACT_APP_API_URL}/borrows/user-borrowed-books`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            // console.log(res.data.borrowedBooks);
            setUserBookBorrowed(res.data.borrowedBooks);
        } catch (error) {
            console.log(error);
        }
    };

    const returnBook = userBookBorrowed.filter(rb => rb.returned === true);

    const noReturnBook = userBookBorrowed.filter(nrb => nrb.returned === false);

    const booksDisplay = activeSection === 'Return' ? returnBook : noReturnBook;

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    return (
        <Stack
            // border='1px solid red'
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

                <Heading
                    // border='1px solid red'
                    fontSize='2xl'
                    fontWeight='700'
                    p='2px 0'
                    bg='linear-gradient(#5B35A4, #3778CC)'
                    bgClip='text'
                    color='transparent'
                >
                    Borrowed Books
                </Heading>

                <Flex
                    // border='1px solid yellow'
                    display='flex'
                    flexDir={['column', 'column', 'row', 'row']}
                    alignItems='start'
                    gap='0.75rem'
                    className={borrowBooksStyle.btnContainer}
                >

                    <Box
                        bgColor={activeSection === 'Return' ? '#000' : "#e8e8e8"}
                        color={activeSection === 'Return' ? '#fff' : "#000"}
                        rounded='md'
                    >
                        <ButtonComp text='Return Books' clickHandler={() => setActiveSection('Return')} />
                    </Box>

                    <Box
                        bgColor={activeSection === 'Non-Return' ? '#000' : "#e8e8e8"}
                        color={activeSection === 'Non-Return' ? '#fff' : "#000"}
                        rounded='md'
                    >
                        <ButtonComp text='Non-Return Books' clickHandler={() => setActiveSection('Non-Return')} />
                    </Box>

                </Flex>

                <Flex>
                    {
                        booksDisplay && booksDisplay.length > 0 ? (
                            <Box
                                // border='1px solid cyan'
                                // h='70vh'
                                w='100%'
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
                                    colorScheme="#fff"
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
                                            userBookBorrowed.map(({ bookTitle, borrowDate, dueDate, returned }, idx) => (
                                                <Tr
                                                    key={idx}
                                                    _hover={{
                                                        backgroundColor: '#101010',
                                                        color: '#fff',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Td textAlign='center' >{idx + 1}.</Td>
                                                    <Td textAlign='center' >{bookTitle}</Td>
                                                    <Td textAlign='center' >
                                                        {(
                                                            () => {
                                                                let bd = new Date(borrowDate);
                                                                return bd.toLocaleDateString('en-GB');
                                                            }
                                                        )()}
                                                    </Td>
                                                    <Td textAlign='center' >
                                                        {(
                                                            () => {
                                                                let rd = new Date(dueDate);
                                                                return rd.toLocaleDateString('en-GB');
                                                            }
                                                        )()}
                                                    </Td>
                                                    <Td textAlign='center' >
                                                        {
                                                            returned ? 'Yes' : 'No'
                                                        }
                                                    </Td>
                                                </Tr>
                                            ))
                                        }
                                    </Tbody>
                                </Table>
                            </Box>
                        ) : activeSection === 'Return' ? (
                            <Text>No return book found!</Text>
                        ) : (
                            <Text>No non-return book found!</Text>
                        )
                    }
                </Flex>
            </Flex>
        </Stack>
    );
};