import { Box, Flex, FormControl, FormErrorMessage, FormLabel, Grid, Heading, Image, Input, InputGroup, InputRightElement, Radio, RadioGroup, Text, useBoolean, useToast } from "@chakra-ui/react";
import { SignInOrSignUp } from "../../components/signInOrSignUp/SignInOrSignUp";
import { Link, useNavigate } from "react-router-dom";
import { logoImg } from "../../assets/Assets";
import { ButtonComp } from "../../components/button/ButtonComp";
import registerStyle from './Register.module.css';
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import axios from 'axios';
import { LoadingIndicator } from "../../components/loaderIndicator/LoadingIndicator";

export const Register = () => {
    const navigate = useNavigate();

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
            try {
                setIsLoading(true);

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

                navigate('/login');
            } catch (error) {
                const errorMsg = error?.response?.data?.msg || "Something went wrong. Please try again.";
                toast({
                    title: "Registration Failed",
                    description: errorMsg,
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
                setIsLoading(false);
            }

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
            <Grid
                // border='1px solid red'
                templateColumns={{
                    base: '1fr',
                    sm: '1fr',
                    md: '1fr 1fr',
                    lg: '1fr 1fr'
                }}
                h='100vh'
                bgColor='#fff'
            >
                {/* Left Side */}
                <Flex
                    display={{
                        base: 'none',
                        sm: 'none',
                        md: 'flex',
                        lg: 'flex'
                    }}
                >
                    <SignInOrSignUp navigateHandler={() => navigate('/login')} isSignUpPage={true} />
                </Flex>

                {/* Right Side */}
                <Flex
                    // border='1px solid teal'
                    alignItems='center'
                    justifyContent='center'
                    p={{
                        base: '0 0.5rem',
                        sm: '0 0.5rem',
                        md: '0',
                        lg: '0'
                    }}
                >
                    <Flex
                        // border='1px solid yellow'
                        flexDir='column'
                        alignItems='center'
                        gap='1rem'
                    >
                        <Image
                            src={logoImg.logo}
                            alt='Logo'
                            // border='1px solid red'
                            w='80px'
                            h='80px'
                        />

                        <Heading
                            fontWeight='600'
                            fontSize='xl'
                        >
                            Sign Up
                        </Heading>

                        <Text>Please provide your information to sign up</Text>

                        <FormControl
                            // border='1px solid red'
                            display='flex'
                            flexDir='column'
                            gap='0.75rem'
                            as='form'
                            onSubmit={signUpHandler}
                        >

                            {/* For Name Input Field */}
                            <FormControl isInvalid={errors.name}>
                                <Grid
                                    templateColumns={{
                                        base: '1fr',
                                        sm: '1fr',
                                        md: '1fr',
                                        lg: '1fr 2fr'
                                    }}
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
                                    templateColumns={{
                                        base: '1fr',
                                        sm: '1fr',
                                        md: '1fr',
                                        lg: '1fr 2fr'
                                    }}
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
                                    templateColumns={{
                                        base: '1fr',
                                        sm: '1fr',
                                        md: '1fr',
                                        lg: '1fr 2fr'
                                    }}
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
                                    templateColumns={{
                                        base: '1fr',
                                        sm: '1fr',
                                        md: '1fr',
                                        lg: '1fr 2fr'
                                    }}
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
                                    templateColumns={{
                                        base: '1fr',
                                        sm: '1fr',
                                        md: '1fr',
                                        lg: '1fr 2fr'
                                    }}
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
                                                placeholder='Password'
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

                                            <InputRightElement className={registerStyle.eyeBtn}>
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
                                    templateColumns={{
                                        base: '1fr',
                                        sm: '1fr',
                                        md: '1fr',
                                        lg: '1fr 2fr'
                                    }}
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
                                                placeholder='Password'
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

                                            <InputRightElement className={registerStyle.eyeBtn}>
                                                <ButtonComp icon={isConfirm ? <FaRegEye /> : <FaEyeSlash />} clickHandler={setIsConfirm.toggle} />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage>{userInfo.password !== userInfo.confirmPassword ? 'Passwords do not match.' : 'Confirm password is required.'}</FormErrorMessage>
                                    </Flex>
                                </Grid>
                            </FormControl>

                            {/* For Submit Button */}
                            <Box className={registerStyle.signUpBtn}>
                                <ButtonComp type='submit' text='SIGN UP' />
                            </Box>

                            <Flex
                                mt='1'
                                display={{
                                    base: 'flex',
                                    sm: 'flex',
                                    md: 'none',
                                    lg: 'none'
                                }}
                                gap='0.25rem'
                                justifyContent={{
                                    base: 'center',
                                    sm: 'center',
                                    md: 'start',
                                    lg: 'start'
                                }}
                            >
                                <Text
                                    fontWeight='semibold'
                                    cursor='pointer'
                                >
                                    Already have an Account?
                                </Text>
                                <Link
                                    to='/login'
                                    style={{
                                        color: '#0000ff'
                                    }}
                                >
                                    Sign In
                                </Link>
                            </Flex>

                            <Text
                                textAlign='center'
                                fontSize='sm'
                            >
                                &copy; {new Date().getFullYear()} Library Management System. All rights reserved.
                            </Text>
                        </FormControl>
                    </Flex>
                </Flex>
            </Grid>
        </>
    );
};