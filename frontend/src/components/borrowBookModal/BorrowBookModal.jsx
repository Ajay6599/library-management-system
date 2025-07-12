import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { ButtonComp } from "../button/ButtonComp";
import borrowBookModalStyle from './BorrowBookModal.module.css';
import axios from 'axios';
import { useState } from "react";

export const BorrowBookModal = ({ isOpen, onClose, onOperation, bookToBorrow }) => {

    console.log(bookToBorrow);

    let [borrowBookData, setBorrowBookData] = useState({
        userEmail: '',
        book_Id: bookToBorrow,
    });

    // let [userEmail, setUserEmail] = useState('');

    const borrowInputHandler = (e) => {
        const { value } = e.target;

        setBorrowBookData({
            userEmail: value,
            book_Id: bookToBorrow
        });
    };

    let toast = useToast();

    const borrowBookHandler = async () => {
        console.log(borrowBookData);
        let token = localStorage.getItem('authToken');

        try {
            // let res = await axios.post(`http://localhost:8080/borrows/borrow`, borrowBookData, {
            //     headers: {
            //         Authorization: `bearer ${token}`
            //     }
            // });

             let res = await axios.post(`${process.env.REACT_APP_API_URL}/borrows/borrow`, borrowBookData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log(res);

            toast({
                title: 'Borrow Book',
                description: res.data.message,
                status: 'success',
                duration: 5000,
                isClosable: true
            });
            onOperation();
            onClose();
        } catch (error) {
            // console.log(error);

            toast({
                title: 'Error!',
                description: error.response?.data?.msg || 'Something went wrong',
                status: 'error',
                duration: 5000,
                isClosable: true
            })
        }
    };

    return (
        <Modal isOpen={isOpen} isCentered>
            <ModalOverlay />

            <ModalContent>
                <ModalHeader>
                    Borrowed Book
                </ModalHeader>

                <ModalBody>
                    User Email
                    <Input
                        type='email'
                        p='0.5rem'
                        mt='0.5rem'
                        placeholder="Borrower's Email"
                        autoComplete="off"
                        borderColor='#202020'
                        focusBorderColor='#202020'
                        _hover={{
                            borderColor: '#202020'
                        }}
                        onChange={borrowInputHandler}
                    />
                </ModalBody>

                <ModalFooter
                    // border='1px solid teal'
                    gap='1rem'
                    className={borrowBookModalStyle.btnContainer}
                >
                    <ButtonComp
                        text='Close'
                        clickHandler={onClose}
                    />
                    <ButtonComp
                        text='Borrow'
                        clickHandler={borrowBookHandler}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};