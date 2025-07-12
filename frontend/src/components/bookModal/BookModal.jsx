import { Divider, Flex, FormControl, FormLabel, Grid, Heading, Image, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { ButtonComp } from "../button/ButtonComp";
import { useEffect, useState } from "react";
import adminStyle from "../../pages/adminDashboard/AdminDashboard.module.css";
import axios from "axios";
import { logoImg } from "../../assets/Assets";
import { LoadingIndicator } from "../loaderIndicator/LoadingIndicator";

export const BookModal = ({ isOpen, onClose, onOperation, bookToUpdated }) => {

    const [isLoading, setIsLoading] = useState(false);

    let addBookForm = [
        { label: 'Title', key: 'title' },
        { label: 'Author', key: 'author' },
        { label: 'Image', key: 'imageUrl' },
        { label: 'ISBN No.', key: 'isbn' },
        { label: 'Category', key: 'category' },
        { label: 'Publisher', key: 'publisher' },
        { label: 'Year Of Publication', key: 'yearOfPublication' },
        { label: 'Copies Available', key: 'copiesAvailable' },
        { label: 'Status', key: 'status' },
        { label: 'Language', key: 'language' }
    ];

    const [booksVal, setBooksVal] = useState({
        title: '',
        author: '',
        imageUrl: '',
        isbn: '',
        category: '',
        publisher: '',
        yearOfPublication: '',
        copiesAvailable: '',
        status: '',
        language: '',
    });

    // Set form fields if a book is being updated
    useEffect(() => {
        if (bookToUpdated) {
            // console.log("Book to update:", bookToUpdated); // Check if the correct data is passed
            setBooksVal({
                title: bookToUpdated.title,
                author: bookToUpdated.author,
                imageUrl: bookToUpdated.imageUrl,
                isbn: bookToUpdated.isbn,
                category: bookToUpdated.category,
                publisher: bookToUpdated.publisher,
                yearOfPublication: bookToUpdated.yearOfPublication,
                copiesAvailable: bookToUpdated.copiesAvailable,
                status: bookToUpdated.status,
                language: bookToUpdated.language,
            });
        } else {
            // Reset the form when opening the modal for adding a new book
            setBooksVal({
                title: '',
                author: '',
                imageUrl: '',
                isbn: '',
                category: '',
                publisher: '',
                yearOfPublication: '',
                copiesAvailable: '',
                status: '',
                language: '',
            });
        }
    }, [bookToUpdated]); // Re-run when bookToUpdate changes


    const handleInputChange = (e) => {
        const { id, value } = e.target;

        const fieldKey = addBookForm.find(field => `${field.label}-${field.key}` === id)?.key;
        if (fieldKey) {
            setBooksVal(prevVal => ({
                ...prevVal,
                [fieldKey]: value,
            }))
        }
    };

    let toast = useToast();

    const handlerAddOrUpdateBook = async () => {
        // console.log(booksVal);

        setIsLoading(true);

        try {
            let token = localStorage.getItem('authToken');
            // console.log(token);

            if (bookToUpdated) {
                // let res = await axios.put(`http://localhost:8080/books/${bookToUpdated._id}`, booksVal, {
                //     headers: {
                //         Authorization: `bearer ${token}`
                //     }
                // });

                let res = await axios.put(`${process.env.REACT_APP_API_URL}/books/${bookToUpdated._id}`, booksVal, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // console.log(res.data);

                toast({
                    title: 'Book Update',
                    description: res.data.msg,
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                });

            } else {
                // let res = await axios.post(`http://localhost:8080/books/add`, booksVal, {
                //     headers: {
                //         Authorization: `bearer ${token}`
                //     }
                // });

                let res = await axios.post(`${process.env.REACT_APP_API_URL}/books/add`, booksVal, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // console.log(res.data);

                toast({
                    title: 'Book Add',
                    description: res.data.msg,
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                });

                setBooksVal({
                    title: '',
                    author: '',
                    imageUrl: '',
                    isbn: '',
                    category: '',
                    publisher: '',
                    yearOfPublication: '',
                    copiesAvailable: '',
                    status: '',
                    language: '',
                });
            }

            onOperation();

            onClose();

        } catch (error) {
            // console.log(error);

            toast({
                title: 'Error!',
                // description: error.response?.data?.msg || 'Something went wrong',
                description: error.response?.data?.msg,
                status: 'error',
                duration: 5000,
                isClosable: true
            })
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {
                isLoading && (
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
                )
            }
            <Modal isOpen={isOpen} onClose={onClose}>

                <ModalOverlay zIndex={isLoading ? 'hide' : 'base'} />

                <ModalContent
                    // border='1px solid red'
                    maxW='540px'
                >
                    <ModalHeader
                        // border='1px solid green'
                        p='0.25rem'
                    >
                        <Grid
                            // border='1px solid blue'
                            templateColumns='1fr'
                            justifyItems='center'
                        // mb='10px'
                        // gap='1rem'
                        >

                            <Image src={logoImg.logo} alt="Logo" w='40px' />

                            <Heading fontWeight='semibold' fontSize='xl'>
                                {bookToUpdated ? 'Update Book' : 'Add Book'}
                            </Heading>

                        </Grid>

                    </ModalHeader>

                    <Divider />

                    <ModalBody
                        // border='1px solid yellow'
                        p='0.5rem 0.25rem'
                        maxHeight='480px'
                        overflowY='auto'
                        css={{
                            "&::-webkit-scrollbar": {
                                width: "6px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#101010",
                                borderRadius: "6px"
                            },
                        }}
                    >
                        <FormControl
                            // border='1px solid green'
                            isRequired
                        >

                            {
                                addBookForm.map(({ label, key }, idx) => (
                                    <Grid
                                        // border='1px solid red'
                                        key={idx}
                                        templateColumns='1fr 2fr'
                                        alignItems='center'
                                        mt='10px'
                                    >
                                        <FormLabel
                                            htmlFor={`${label}-${key}`}
                                            mt='1'
                                        >
                                            {label}
                                        </FormLabel>
                                        <Input
                                            id={`${label}-${key}`}
                                            type="text"
                                            borderColor='#202020'
                                            focusBorderColor='#202020'
                                            _hover={{
                                                borderColor: '#202020'
                                            }}
                                            p='0 10px'
                                            autoComplete="off"
                                            value={booksVal[key]}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                ))
                            }

                            <Grid
                                // border='2px solid red'
                                templateColumns='100px'
                                alignItems='center'
                                justifyContent='center'
                                mt='10px'
                                className={adminStyle.submitBtnContainer}
                            >
                                <ButtonComp type='submit' text={bookToUpdated ? 'UPDATE' : 'SUBMIT'} clickHandler={handlerAddOrUpdateBook} />
                            </Grid>

                        </FormControl>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};