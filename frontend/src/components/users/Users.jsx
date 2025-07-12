import { Box, Flex, Grid, Heading, Input, Stack, Table, Tbody, Td, Th, Thead, Tooltip, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { ButtonComp } from "../button/ButtonComp";
import { MdDelete, MdEdit } from "react-icons/md";
import adminStyle from "../../pages/adminDashboard/AdminDashboard.module.css";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { LoadingIndicator } from "../loaderIndicator/LoadingIndicator";
import { StudModal } from "../studModal/StudModal";
import { Header } from "../header/Header";

export const Users = () => {

    const studTableHead = ["Sr. No.", "Name", "Email", "Role", "No. of Books Borrowed","Registered On", "Action"];

    let { isOpen, onOpen, onClose } = useDisclosure();

    let [operationType, setOperationType] = useState('');

    let [selectedUser, setSelectedUser] = useState(null);

    const openModal = (opr, user = null) => {
        // console.log(opr, book);

        console.log("first console", operationType, selectedUser);

        setOperationType(opr);
        setSelectedUser(user);

        // console.log("sec console", operationType, selectedUser);

        onOpen();
    };

    let initialState = {
        userDetails: [],
        isLoading: false,
        isError: null
    };

    let userReducer = (state, action) => {
        switch (action.type) {
            case "FETCH_WAITING":
                return {
                    ...state,
                    isLoading: true,
                    isError: null
                };
            case "FETCH_SUCCESS":
                return {
                    ...state,
                    isLoading: false,
                    userDetails: action.payload,
                };
            case "FETCH_FAILURE":
                return {
                    ...state,
                    isLoading: false,
                    isError: action.payload
                };
            default:
                return state;
        }
    };

    let [state, dispatch] = useReducer(userReducer, initialState);

    let { isLoading, userDetails } = state;

    // Fetch User Details

    const fetchUserDetails = async () => {
        dispatch({
            type: 'FETCH_WAITING'
        });
        try {

            const token = localStorage.getItem('authToken');

            // let res = await axios.get(`http://localhost:8080/users/`, {
            //     headers: {
            //         Authorization: `bearer ${token}`
            //     }
            // });

            let res = await axios.get(`${process.env.REACT_APP_API_URL}/users/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(res.data.AllStudents);
            dispatch({
                type: "FETCH_SUCCESS",
                payload: res.data.AllStudents
            })
        } catch (error) {
            dispatch({
                type: "FETCH_FAILURE",
                payload: error
            });
            console.log(error);
        }
    };

    let toast = useToast();

    // Adding Book API hit

    const onHandlerAddUser = () => {
        fetchUserDetails();
    };

    // Updating Book Api hit 

    const onHandlerUpdateUser = () => {
        fetchUserDetails();
    };

    // Deleting Book Api hit

    const handlerDeleteUser = async (userId) => {

        try {
            let token = localStorage.getItem('authToken');

            // let res = await axios.delete(`http://localhost:8080/users/${userId}`, {
            //     headers: {
            //         Authorization: `bearer ${token}`
            //     }
            // });

            let res = await axios.delete(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast({
                title: 'User',
                description: res.data.msg,
                status: 'success',
                duration: 5000,
                isClosable: true
            });

            fetchUserDetails();

        } catch (error) {
            // console.log(error);

            toast({
                title: 'Server Error',
                description: error.msg,
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        }
    };

    // Find Users
    let [filterUsers, setFilterUsers] = useState(userDetails);

    const findUsersHandler = (e) => {
        setFilterUsers(userDetails.filter(srchUsers => srchUsers.name.toLowerCase().includes(e.target.value)));

        // console.log(filterUsers);
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    useEffect(() => {
        setFilterUsers(userDetails);
    }, [userDetails]);

    return (
        <Stack
            bgColor='transparent'
            // border='1px solid green'
            ml={['0px', '0px', '220px', '220px']}
            pos='relative'
        >
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
                        <Header />

                        <Flex
                            // border='1px solid lightblue'
                            flexDir='column'
                            gap='1rem'
                            m='4rem 0.5rem 0'
                        >
                            <Grid
                                // border='1px solid red'
                                templateColumns={['1fr', '1fr', '2fr 1fr', '2fr 1fr']}
                                gap='1rem'
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
                                    Registered Users
                                </Heading>

                                <Box>
                                    <Input
                                        type="search"
                                        placeholder="Find Users"
                                        w={['70%', '70%', '100%', '100%']}
                                        p='0.5rem'
                                        bgColor='#fff'
                                        borderColor='#202020'
                                        focusBorderColor='#202020'
                                        _hover={{
                                            borderColor: '#202020'
                                        }}
                                        autoComplete="off"
                                        onChange={findUsersHandler}
                                    />
                                </Box>

                            </Grid>

                            <Box
                                // border='1px solid cyan'
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
                                                studTableHead.map((item, idx) => (
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
                                            filterUsers.map(({ _id, name, gender, email, phoneNumber, role, borrowedBooks }, idx) => (
                                                <Tr
                                                    key={`${email} + ${idx}`}
                                                    _hover={{
                                                        backgroundColor: '#101010',
                                                        color: '#fff',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Td textAlign='center'>{idx + 1}.</Td>
                                                    {/* <Td textAlign='center'>
                                                    <Image src={imageUrl} alt='Book Img' w='32px' />
                                                </Td> */}
                                                    <Td textAlign='center'>
                                                        {name}
                                                    </Td>
                                                    <Td textAlign='center'>
                                                        {email}
                                                    </Td>
                                                    <Td textAlign='center'>
                                                        {role}
                                                    </Td>
                                                    <Td textAlign='center'>
                                                        {borrowedBooks.length}
                                                    </Td>
                                                    <Td textAlign='center'>
                                                        02/05/2025
                                                    </Td>
                                                    <Td textAlign='center'>
                                                        <Flex
                                                            // border='1px solid teal'
                                                            alignItems='center'
                                                            justifyContent='space-around'
                                                            className={adminStyle.editDeleteUserBtnContainer}
                                                        >
                                                            <Tooltip
                                                                label='Update'
                                                            >
                                                                <Box>
                                                                    <ButtonComp
                                                                        icon={<MdEdit size='20' />}
                                                                        clickHandler={() => {
                                                                            openModal('Update User', { _id, name, gender, email, phoneNumber, role });
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Tooltip>

                                                            <Tooltip label='Delete'>
                                                                <Box>
                                                                    <ButtonComp icon={<MdDelete size='20' />} clickHandler={() => handlerDeleteUser(_id)} />
                                                                </Box>
                                                            </Tooltip>
                                                        </Flex>
                                                    </Td>
                                                </Tr>
                                            ))
                                        }
                                    </Tbody>
                                </Table>
                            </Box>

                            {/* Create Modal Component */}

                            <StudModal
                                isOpen={isOpen}
                                onClose={onClose}
                                onOperation={operationType === 'Add User' ? onHandlerAddUser : onHandlerUpdateUser}
                                userToUpdated={selectedUser}
                            />
                        </Flex>
                    </>
                )
            }
        </Stack>
    );
};