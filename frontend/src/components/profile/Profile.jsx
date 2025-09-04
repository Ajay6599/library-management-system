import { Box, Flex, FormControl, FormLabel, Grid, Heading, Input, InputGroup, InputRightElement, Stack, Text, useBoolean, useToast } from "@chakra-ui/react";
import { Header } from "../header/Header";
import { ButtonComp } from "../button/ButtonComp";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import axios from 'axios';
import addUserAdminStyle from '../addUserAdmin/AddUserAdmin.module.css'
import { LoadingIndicator } from "../loaderIndicator/LoadingIndicator";

export const Profile = () => {
    let [isShow, setIsShow] = useBoolean();
    let [isConfirm, setIsConfirm] = useBoolean();
    let [isLoading, setIsLoading] = useState(false);

    const storedUserDetails = localStorage.getItem('userDetails');
    const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : {};

    let [updateInfo, setUpdateInfo] = useState({
        name: userDetails.name || '',
        phoneNumber: userDetails.phoneNo || '',
        email: userDetails.email || '',
        password: '',
        confirmPassword: ''
    });

    const handlerInputChange = (e) => {
        const { id, value } = e.target;

        setUpdateInfo(prevInfo => ({
            ...prevInfo,
            [id]: value
        }));
    };

    let toast = useToast();

    const updateProfile = async (e) => {
        e.preventDefault();

        const updatedData = { ...updateInfo };

        // Remove password fields if they are empty
        if (!updatedData.password) delete updatedData.password;
        if (!updatedData.confirmPassword) delete updatedData.confirmPassword;

        setIsLoading(true);

        try {
            let token = localStorage.getItem("authToken");
            //     // let res = await axios.put(`http://localhost:8080/users/${userToUpdated._id}`, userVal, {
            //     headers: {
            //         Authorization: `bearer ${token}`
            //     }
            // });

            let res = await axios.put(`${process.env.REACT_APP_API_URL}/users/me`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // console.log(res.data);

            toast({
                title: 'Profile Updated',
                description: res.data.msg,
                status: 'success',
                duration: 5000,
                isClosable: true
            });

        } catch (error) {
            const errorMsg = error?.response?.data?.msg || "Something went wrong. Please try again.";
            toast({
                title: "Profile Updated Failed",
                description: errorMsg,
                status: "error",
                duration: 5000,
                isClosable: true
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Stack
            bgColor='transparent'
            ml={['0px', '0px', '220px', '220px']}
            pos='relative'
        // border='1px solid green'
        >
            <Header />

            <Flex
                // border='2px solid teal'
                flexDir='column'
                gap='1rem'
                m='4rem 0.5rem 0'
            >
                <Heading
                    // border='1px solid red'
                    w='100%'
                    fontSize='2xl'
                    fontWeight='700'
                    p='2px 0'
                    bg='linear-gradient(#5B35A4, #3778CC)'
                    bgClip='text'
                    color='transparent'
                >
                    Profile
                </Heading>

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
                        <FormControl
                            // border='1px solid green'
                            borderRadius='md'
                            bgColor='#fff'
                            w={['100%', '100%', '100%', '72%']}
                            p='1rem'
                            display='flex'
                            flexDir='column'
                            gap='0.75rem'
                            boxShadow='0 0 2px 1px #696969'
                            as='form'
                            onSubmit={updateProfile}
                        >

                            {/* For Name Input Field */}
                            <Grid
                                templateColumns={['1fr', '1fr', '1fr 2fr', '1fr 2fr']}
                                alignItems='center'
                            >
                                <FormLabel htmlFor="name">
                                    Name
                                </FormLabel>
                                <Flex
                                    flexDir='column'
                                >
                                    <Input
                                        id='name'
                                        type="text"
                                        p='0.5rem'
                                        borderColor='#202020'
                                        focusBorderColor='#202020'
                                        _hover={{
                                            borderColor: '#202020'
                                        }}
                                        autoComplete='off'
                                        value={updateInfo.name}
                                        onChange={handlerInputChange}
                                    />
                                </Flex>
                            </Grid>

                            {/* For Mobile Number Input Field */}
                            <Grid
                                templateColumns={['1fr', '1fr', '1fr 2fr', '1fr 2fr']}
                                alignItems='center'
                            >
                                <FormLabel htmlFor="phoneNumber">
                                    Mobile No.
                                </FormLabel>
                                <Flex
                                    flexDir='column'
                                >
                                    <Input
                                        id='phoneNumber'
                                        type="tel"
                                        p='0.5rem'
                                        borderColor='#202020'
                                        focusBorderColor='#202020'
                                        _hover={{
                                            borderColor: '#202020'
                                        }}
                                        autoComplete='off'
                                        maxLength='10'
                                        value={updateInfo.phoneNumber}
                                        onChange={handlerInputChange}
                                    />
                                </Flex>
                            </Grid>

                            {/* For Email Input Field */}
                            <Grid
                                templateColumns={['1fr', '1fr', '1fr 2fr', '1fr 2fr']}
                                alignItems='center'
                            >
                                <FormLabel htmlFor="email">
                                    Email
                                </FormLabel>
                                <Flex
                                    flexDir='column'
                                >
                                    <Input
                                        id='email'
                                        type="email"
                                        p='0.5rem'
                                        borderColor='#202020'
                                        focusBorderColor='#202020'
                                        _hover={{
                                            borderColor: '#202020'
                                        }}
                                        autoComplete='off'
                                        value={updateInfo.email}
                                        onChange={handlerInputChange}
                                    />
                                </Flex>
                            </Grid>

                            {/* For Password Input Field */}
                            <Grid
                                templateColumns={['1fr', '1fr', '1fr 2fr', '1fr 2fr']}
                                alignItems='center'
                            >
                                <FormLabel htmlFor="password">
                                    Password
                                </FormLabel>
                                <Flex
                                    flexDir='column'
                                >
                                    <InputGroup>
                                        <Input
                                            id='password'
                                            type={isShow ? 'text' : 'password'}
                                            p='0.5rem'
                                            borderColor='#202020'
                                            focusBorderColor='#202020'
                                            _hover={{
                                                borderColor: '#202020'
                                            }}
                                            autoComplete='off'
                                            value={updateInfo.password}
                                            onChange={handlerInputChange}
                                        />

                                        <InputRightElement className={addUserAdminStyle.eyeBtn}>
                                            <ButtonComp icon={isShow ? <FaRegEye /> : <FaEyeSlash />} clickHandler={setIsShow.toggle} />
                                        </InputRightElement>
                                    </InputGroup>
                                </Flex>
                            </Grid>

                            {/* For Confirm Password Input Field */}
                            <Grid
                                templateColumns={['1fr', '1fr', '1fr 2fr', '1fr 2fr']}
                                alignItems='center'
                            >
                                <FormLabel htmlFor="confirmPassword">
                                    Confirm Password
                                </FormLabel>
                                <Flex
                                    flexDir='column'
                                >
                                    <InputGroup>
                                        <Input
                                            id='confirmPassword'
                                            type={isConfirm ? 'text' : 'password'}
                                            p='0.5rem'
                                            borderColor='#202020'
                                            focusBorderColor='#202020'
                                            _hover={{
                                                borderColor: '#202020'
                                            }}
                                            autoComplete='off'
                                            value={updateInfo.confirmPassword}
                                            onChange={handlerInputChange}
                                        />

                                        <InputRightElement className={addUserAdminStyle.eyeBtn}>
                                            <ButtonComp icon={isConfirm ? <FaRegEye /> : <FaEyeSlash />} clickHandler={setIsConfirm.toggle} />
                                        </InputRightElement>
                                    </InputGroup>
                                </Flex>
                            </Grid>

                            {/* For Submit Button */}
                            <Box
                                className={addUserAdminStyle.addUser}
                                textAlign='center'
                            >
                                <ButtonComp type='submit' text='Update Profile' />
                            </Box>

                            <Text
                                textAlign='center'
                                fontSize='sm'
                            >
                                &copy; {new Date().getFullYear()} Library Management System. All rights reserved.
                            </Text>
                        </FormControl>
                    )
                }
            </Flex>
        </Stack>
    );
};