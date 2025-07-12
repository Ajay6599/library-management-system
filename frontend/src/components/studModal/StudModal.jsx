import { Divider, FormControl, FormLabel, Grid, Heading, Image, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { ButtonComp } from "../button/ButtonComp";
import { useEffect, useState } from "react";
import adminStyle from "../../pages/adminDashboard/AdminDashboard.module.css";
import axios from "axios";
import { logoImg } from "../../assets/Assets";

export const StudModal = ({ isOpen, onClose, onOperation, userToUpdated }) => {

    let addUserForm = [
        { label: 'Name', key: 'name' },
        { label: 'Gender', key: 'gender' },
        { label: 'Phone Number', key: 'phoneNumber' },
        { label: 'Email', key: 'email' },
        { label: 'Password', key: 'password' },
        { label: 'Confirm Password', key: 'confirmPassword' },
        { label: 'Role', key: 'role' },
    ];

    const [userVal, setUserVal] = useState({
        name: '',
        gender: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Student',
    });

    // Set form fields if a user is being updated
    useEffect(() => {
        if (userToUpdated) {
            // console.log("Book to update:", bookToUpdated); // Check if the correct data is passed
            setUserVal({
                name: userToUpdated.name || '',
                gender: userToUpdated.gender || '',
                phoneNumber: userToUpdated.phoneNumber || '',
                email: userToUpdated.email || '',
                password: userToUpdated.password || '',
                confirmPassword: userToUpdated.confirmPassword || '',
                role: userToUpdated.role || 'Student',
            });
        } else {
            // Reset the form when opening the modal for adding a new user
            setUserVal({
                name: '',
                gender: '',
                phoneNumber: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'Student',
            });
        }
    }, [userToUpdated]); // Re-run when bookToUpdate changes


    const handleInputChange = (e) => {
        const { id, value } = e.target;

        const fieldKey = addUserForm.find(field => `${field.label}-${field.key}` === id)?.key;
        if (fieldKey) {
            setUserVal(prevVal => ({
                ...prevVal,
                [fieldKey]: value || '',
            }))
        }
    };

    let toast = useToast();

    const handlerAddOrUpdateUser = async () => {
        // console.log(userVal);

        try {
            let token = localStorage.getItem('authToken');
            // console.log(token);

            if (userToUpdated) {
                // let res = await axios.put(`http://localhost:8080/users/${userToUpdated._id}`, userVal, {
                //     headers: {
                //         Authorization: `bearer ${token}`
                //     }
                // });

                let res = await axios.put(`${process.env.REACT_APP_API_URL}/users/${userToUpdated._id}`, userVal, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // console.log(res.data);

                toast({
                    title: 'User Update',
                    description: res.data.msg,
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                });

            } else {
                // let res = await axios.post(`http://localhost:8080/users/register`, userVal);

                let res = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, userVal);

                // console.log(res.data);

                toast({
                    title: 'User Added',
                    description: res.data.msg,
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                })
            }

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
        <Modal isOpen={isOpen} onClose={onClose}>

            <ModalOverlay />

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
                    >

                        <Image src={logoImg.logo} alt="Logo" w='40px' />

                        <Heading fontWeight='semibold' fontSize='xl'>
                            {userToUpdated ? 'Update User' : 'Add User'}
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
                            addUserForm.map(({ label, key }, idx) => (
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
                                        value={userVal[key]}
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
                            <ButtonComp type='submit' text={userToUpdated ? 'UPDATE' : 'SUBMIT'} clickHandler={handlerAddOrUpdateUser} />
                        </Grid>

                    </FormControl>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};