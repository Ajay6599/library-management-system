import { Box, Flex, FormControl, FormErrorMessage, FormLabel, Grid, Heading, Input, InputGroup, InputRightElement, Radio, RadioGroup, Stack, Text, useBoolean, useToast } from "@chakra-ui/react";
import { Header } from "../header/Header";
import { ButtonComp } from "../button/ButtonComp";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import axios from 'axios';
import addUserAdminStyle from './AddUserAdmin.module.css'
import { LoadingIndicator } from "../loaderIndicator/LoadingIndicator";

export const AddUserAdmin = () => {
    let [isShow, setIsShow] = useBoolean();
    let [isConfirm, setIsConfirm] = useBoolean();
    let [isLoading, setIsLoading] = useState(false);

    let [userInfo, setUserInfo] = useState({
        name: '',
        gender: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        name: false,
        gender: false,
        phoneNumber: false,
        email: false,
        password: false,
        confirmPassword: false
    });

    const handlerInputChange = (e) => {
        const { id, value } = e.target;

        setUserInfo(prevInfo => ({
            ...prevInfo,
            [id]: value
        }));
    };

    let toast = useToast();

    const signUpHandler = async (e) => {
        e.preventDefault();

        const newErrors = {
            name: !userInfo.name,
            gender: !userInfo.gender,
            phoneNumber: !userInfo.phoneNumber,
            email: !userInfo.email,
            password: !userInfo.password,
            confirmPassword:
                !userInfo.confirmPassword || userInfo.password !== userInfo.confirmPassword
        };

        // If there are errors, show them
        setErrors(newErrors);

        // If no errors, proceed with form submission

        if (Object.values(newErrors).every((error) => !error)) {
            setIsLoading(true);

            try {
                // let res = await axios.post(`http://localhost:8080/users/register`, userInfo);
                let res = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, userInfo);
                // console.log(res.data);
                // console.log('Form submitted successfully', userInfo);
                setUserInfo({
                    name: '',
                    gender: '',
                    phoneNumber: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                })
                toast({
                    title: 'You have created account',
                    description: res.data.msg,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });

            } catch (error) {
                const errorMsg = error?.response?.data?.msg || "Something went wrong. Please try again.";
                toast({
                    title: "Registration Failed",
                    description: errorMsg,
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            } finally {
                setIsLoading(false);
            }

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
                    Add New User/Admin
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
                            onSubmit={signUpHandler}
                        >

                            {/* For Name Input Field */}
                            <FormControl isInvalid={errors.name}>
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
                                            value={userInfo.name}
                                            onChange={handlerInputChange}
                                        />
                                        <FormErrorMessage>Name is required.</FormErrorMessage>
                                    </Flex>
                                </Grid>
                            </FormControl>

                            {/* For Gender Input Field */}
                            <FormControl isInvalid={errors.gender}>
                                <Grid
                                    templateColumns={['1fr', '1fr', '1fr 2fr', '1fr 2fr']}
                                    alignItems='center'
                                >
                                    <FormLabel htmlFor="gender">
                                        Gender
                                    </FormLabel>
                                    <Flex
                                        flexDir='column'
                                    >
                                        <RadioGroup
                                            id="gender"
                                            onChange={(value) => setUserInfo(prev => ({ ...prev, gender: value }))}
                                            value={userInfo.gender}
                                        >
                                            <Flex gap="1rem">
                                                <Radio value="Male" borderColor='#202020'>Male</Radio>
                                                <Radio value="Female" borderColor='#202020'>Female</Radio>
                                                <Radio value="Other" borderColor='#202020'>Other</Radio>
                                            </Flex>
                                        </RadioGroup>
                                        <FormErrorMessage>Gender is required.</FormErrorMessage>
                                    </Flex>
                                </Grid>
                            </FormControl>

                            {/* For Mobile Number Input Field */}
                            <FormControl isInvalid={errors.phoneNumber}>
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
                                            value={userInfo.phoneNumber}
                                            onChange={handlerInputChange}
                                        />
                                        <FormErrorMessage>Mobile number is required.</FormErrorMessage>
                                    </Flex>
                                </Grid>
                            </FormControl>

                            {/* For Email Input Field */}
                            <FormControl isInvalid={errors.email}>
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
                                            value={userInfo.email}
                                            onChange={handlerInputChange}
                                        />
                                        <FormErrorMessage>Email is required.</FormErrorMessage>
                                    </Flex>
                                </Grid>
                            </FormControl>

                            {/* For Password Input Field */}
                            <FormControl isInvalid={errors.password}>
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
                                                value={userInfo.password}
                                                onChange={handlerInputChange}
                                            />

                                            <InputRightElement className={addUserAdminStyle.eyeBtn}>
                                                <ButtonComp icon={isShow ? <FaRegEye /> : <FaEyeSlash />} clickHandler={setIsShow.toggle} />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage>Password is required.</FormErrorMessage>
                                    </Flex>
                                </Grid>
                            </FormControl>

                            {/* For Confirm Password Input Field */}
                            <FormControl isInvalid={errors.confirmPassword}>
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
                                                value={userInfo.confirmPassword}
                                                onChange={handlerInputChange}
                                            />

                                            <InputRightElement className={addUserAdminStyle.eyeBtn}>
                                                <ButtonComp icon={isConfirm ? <FaRegEye /> : <FaEyeSlash />} clickHandler={setIsConfirm.toggle} />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage>{userInfo.password !== userInfo.confirmPassword ? 'Passwords do not match.' : 'Confirm password is required.'}</FormErrorMessage>
                                    </Flex>
                                </Grid>
                            </FormControl>

                            {/* For Submit Button */}
                            <Box
                                className={addUserAdminStyle.addUser}
                                textAlign='center'
                            >
                                <ButtonComp type='submit' text='Add User' />
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