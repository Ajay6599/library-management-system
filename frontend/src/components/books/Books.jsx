import { Box, Flex, Grid, Heading, Image, Input, Stack, Table, Tbody, Td, Th, Thead, Tooltip, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { ButtonComp } from "../button/ButtonComp";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { FaClipboardCheck } from "react-icons/fa6";
import adminStyle from "../../pages/adminDashboard/AdminDashboard.module.css";
import { useContext, useEffect, useState } from "react";
import { BookContext } from "../../context/BookContextProvider";
import axios from "axios";
import { BookModal } from "../bookModal/BookModal";
import { Header } from "../header/Header";
import { AuthContext } from "../../context/AuthContextProvider";
import { BorrowBookModal } from "../borrowBookModal/BorrowBookModal";
import { LoadingIndicator } from "../loaderIndicator/LoadingIndicator";

export const Books = () => {

    let { role } = useContext(AuthContext);

    let adminTableHead = ["Sr. No.", "Image", "Title", "Author", "Status", "Quantity", "Action"];
    let userTableHead = ["Sr. No.", "Image", "Title", "Author", "Status"];

    let { isOpen: isUpdDelOpen, onOpen: onUpdDelOpen, onClose: onUpdDelClose } = useDisclosure();

    let { isOpen: isBorrowModalOpen, onOpen: onBorrowModalOpen, onClose: onBorrowModalClose } = useDisclosure();

    let [operationType, setOperationType] = useState('');

    let [selectedBook, setSelectedBook] = useState(null);

    const openModal = (opr, book = null) => {
        if (opr === 'Borrow Book') {
            setOperationType(opr);
            setSelectedBook(book);

            onBorrowModalOpen();
        } else {
            setOperationType(opr);
            setSelectedBook(book);

            onUpdDelOpen();
        }
    };

    let { books, fetchAllBooks, isLoading, setIsLoading } = useContext(BookContext);

    // console.log(books);

    let [filterBooks, setFilterBooks] = useState(books);

    const searchBookHandler = (e) => {
        
        setFilterBooks(books.filter(srchBook => srchBook.title.toLowerCase().includes(e.target.value.toLowerCase())));

    };

    let toast = useToast();

    // Adding Book API hit

    const onHandlerAddBook = () => {
        fetchAllBooks();
    };

    // Updating Book Api hit 

    const onHandlerUpdateBook = () => {
        fetchAllBooks();
    };

    // Deleting Book Api hit

    const handlerDeleteBook = async (bookId) => {
        // console.log('bookId: ', bookId);

        setIsLoading(true);
        try {
            let token = localStorage.getItem('authToken');

            // let res = await axios.delete(`http://localhost:8080/books/${bookId}`, {
            //     headers: {
            //         Authorization: `bearer ${token}`
            //     }
            // });

            let res = await axios.delete(`${process.env.REACT_APP_API_URL}/books/${bookId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // console.log(res.data);

            toast({
                title: 'Books Deleted',
                description: res.data.msg,
                status: 'success',
                duration: 5000,
                isClosable: true
            });

            fetchAllBooks();

        } catch (error) {
            // console.log(error);

            toast({
                title: 'Book Deleted',
                description: error.msg,
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Borrowed Book Api hit
    const onBorrowedBook = () => {
        fetchAllBooks();
    }

    useEffect(() => {
        setFilterBooks(books);
    }, [books]);

    return (
        <Stack
            // border='1px solid red'
            bgColor='transparent'
            ml={['0px', '0px', '220px', '220px']}
            pos='relative'
        >
            {/* Header Component */}
            <Header />

            {/* Books Management */}
            <Flex
                // border='1px solid blue'
                flexDir='column'
                gap='1rem'
                m='4rem 0.5rem 0'
            >
                {/* Heading Content / Add Button / Search Book */}
                <Flex
                    // border='1px solid green'
                    flexDir={['column', 'column', 'row', 'row']}
                    justifyContent='space-between'
                    alignItems={['start', 'start', 'center', 'center']}
                    p={['0', '0', '0.25rem', '0.25rem']}
                    gap={['1rem', '1rem', '1rem', '0rem']}
                >
                    <Heading
                        // border='1px solid red'
                        fontSize='2xl'
                        fontWeight='700'
                        textAlign='center'
                        p='2px 0'
                        bg='linear-gradient(#5B35A4, #3778CC)'
                        bgClip='text'
                        color='transparent'
                    >
                        Book Management
                    </Heading>

                    <Grid
                        // border='1px solid green'
                        templateColumns={role === 'Student' ? '1fr' : '102px 1fr'}
                        gap={role === 'Student' ? '0' : '1rem'}
                    >
                        {
                            role === 'Admin' && (
                                <Box
                                    // border='1px solid red'
                                    className={adminStyle.addBookBtnContainer}
                                >
                                    <ButtonComp text='Add Book' icon={<MdAdd size='18' />} clickHandler={() => openModal('Add Book')} />
                                </Box>
                            )
                        }

                        <Input
                            type='text'
                            placeholder="Find Books"
                            p='0.5rem'
                            bgColor='#fff'
                            borderColor='#202020'
                            focusBorderColor='#202020'
                            _hover={{
                                borderColor: '#202020'
                            }}
                            onChange={searchBookHandler}
                        />
                    </Grid>
                </Flex>

                {
                    isLoading ? (
                        <Flex
                            position="fixed"
                            top="0"
                            left="0"
                            w="100vw"
                            h="100vh"
                            bg="rgba(255, 255, 255, 0.7)"
                            alignItems="center"
                            justifyContent="center"
                            zIndex="overlay"
                        >
                            <LoadingIndicator />
                        </Flex>
                    ) : (
                        <>
                            <Box
                                // border='1px solid cyan'
                                h='79vh'
                                overflow='auto'
                                css={{
                                    "&::-webkit-scrollbar": {
                                        width: "4px",
                                        height: "6px",
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
                                                role === 'Student' ? userTableHead.map((item, idx) => (
                                                    <Th
                                                        key={idx + item}
                                                        color='yellow'
                                                        fontWeight='500'
                                                        textAlign='center'
                                                    >
                                                        {item}
                                                    </Th>
                                                )) : adminTableHead.map((item, idx) => (
                                                    <Th
                                                        key={idx + item}
                                                        color='yellow'
                                                        fontWeight='500'
                                                        textAlign='center'
                                                    >
                                                        {item}
                                                    </Th>
                                                ))
                                            }
                                        </Tr>
                                    </Thead>
                                    <Tbody
                                    >
                                        {
                                            filterBooks.map(({ _id, title, imageUrl, author, isbn, category, publisher, yearOfPublication, status, copiesAvailable, language }, idx) => (
                                                <Tr
                                                    key={`${title} + ${idx}`}
                                                    _hover={{
                                                        backgroundColor: '#101010',
                                                        color: '#fff',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Td textAlign='center' pt='1' pb='1'>{idx + 1}.</Td>
                                                    <Td textAlign='center' pt='1' pb='1'>
                                                        <Image
                                                            src={imageUrl}
                                                            alt='Book Img'
                                                            display='block'
                                                            ml='auto'
                                                            mr='auto'
                                                            w='32px'
                                                        />
                                                    </Td>
                                                    <Td textAlign='center' pt='1' pb='1'>
                                                        {title.length > 20 ? title.substring(0, 20).concat('...') : title}
                                                    </Td>
                                                    <Td textAlign='center' pt='1' pb='1'>
                                                        {author}
                                                    </Td>
                                                    <Td textAlign='center' pt='1' pb='1'>
                                                        {status}
                                                    </Td>
                                                    {
                                                        role === 'Admin' && (
                                                            <>
                                                                <Td textAlign='center' pt='1' pb='1'>
                                                                    {copiesAvailable}
                                                                </Td>
                                                                <Td textAlign='center' pt='1' pb='1'>
                                                                    <Flex
                                                                        // border='1px solid teal'
                                                                        alignItems='center'
                                                                        justifyContent='space-around'
                                                                        className={adminStyle.editDeleteBookBtnContainer}
                                                                    >

                                                                        <Tooltip label='Borrow Book'>
                                                                            <Box>
                                                                                <ButtonComp
                                                                                    icon={<FaClipboardCheck size='20' />}
                                                                                    clickHandler={() => openModal('Borrow Book', { _id })}
                                                                                />
                                                                            </Box>
                                                                        </Tooltip>

                                                                        <Tooltip
                                                                            label='Update'
                                                                        >
                                                                            <Box>
                                                                                <ButtonComp
                                                                                    icon={<MdEdit size='20' />}
                                                                                    clickHandler={() => {
                                                                                        openModal('Update Book', { _id, title, imageUrl, author, isbn, category, publisher, yearOfPublication, status, copiesAvailable, language });
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        </Tooltip>

                                                                        <Tooltip label='Delete'>
                                                                            <Box>
                                                                                <ButtonComp icon={<MdDelete size='20' />} clickHandler={() => handlerDeleteBook(_id)} />
                                                                            </Box>
                                                                        </Tooltip>
                                                                    </Flex>
                                                                </Td>
                                                            </>
                                                        )
                                                    }
                                                </Tr>
                                            ))
                                        }
                                    </Tbody>
                                </Table>
                            </Box>

                            {/* Create Modal Component */}

                            <BookModal
                                isOpen={isUpdDelOpen}
                                onClose={onUpdDelClose}
                                onOperation={operationType === 'Add Book' ? onHandlerAddBook : onHandlerUpdateBook}
                                bookToUpdated={selectedBook}
                            />

                            <BorrowBookModal
                                isOpen={isBorrowModalOpen}
                                onClose={onBorrowModalClose}
                                onOperation={onBorrowedBook}
                                bookToBorrow={selectedBook}
                            />
                        </>
                    )
                }
            </Flex>
        </Stack>
    );
};