import { Box, Flex, FormControl, FormErrorMessage, Grid, Heading, IconButton, Image, Input, InputGroup, InputRightElement, Text, useBoolean, useToast } from '@chakra-ui/react';
import { SignInOrSignUp } from '../../components/signInOrSignUp/SignInOrSignUp';
import { logoImg } from '../../assets/Assets';
import { ButtonComp } from '../../components/button/ButtonComp';
import loginStyle from './Login.module.css';
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContextProvider';
import { LoadingIndicator } from '../../components/loaderIndicator/LoadingIndicator';

export const Login = () => {

    const navigate = useNavigate();
    let { isAuth, login } = useContext(AuthContext);

    let toast = useToast();

    let [isShow, setIsShow] = useBoolean();

    const [isLoading, setIsLoading] = useState(false);

    let [userDetails, setUserDetails] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: false,
        password: false,
        passwordMessage: ''
    });

    const hanldeInputChange = (e) => {
        const { id, value } = e.target;

        setUserDetails(prevState => ({
            ...prevState,
            [id]: value
        }))
    };

    const onSignIn = async (e) => {
        e.preventDefault();

        const emailError = !userDetails.email;
        const passwordError = !userDetails.password;

        setErrors({
                email: emailError,
                password: passwordError,
                passwordMessage: passwordError ? 'Password is required' : ''
            });

        if (emailError || passwordError) return;

        // If no errors, proceed with form submission

        try {
            setIsLoading(true);
            // let res = await axios.post(`http://localhost:8080/users/login`, userDetails);
            let res = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, userDetails);

            // console.log(res.data.msg);
            login(res.data.authToken, res.data.name, res.data.phoneNo, res.data.gender, res.data.email);
            setUserDetails({
                email: '',
                password: '',
            })
            toast({
                title: 'You have logged in',
                description: res.data.msg,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {

            let errMsg = error.response?.data?.msg || 'Something went wrong.';

            setErrors({
                email: false,
                password: true,
                // passwordMessage: errMsg.includes('Invalid') ? 'Invalid email or password.' : errMsg,
                passwordMessage: errMsg
            });

            toast({
                title: 'Login Failed',
                description: errMsg,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuth) {
            navigate('/');
        }
    }, [isAuth, navigate]);

    if (isAuth) {
        return <Navigate to='/' />;
    }

    return (
        <>
            {isLoading && (
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
            )}

            <Grid
                // border='1px solid red'
                templateColumns={['1fr', '1fr', '1fr 1fr', '1fr 1fr']}
                h='100vh'
                bgColor='#fff'
            >

                {/* Left Side */}
                <Flex
                    // border='1px solid teal'
                    alignItems='center'
                    justifyContent='center'
                    p={['0 0.5rem', '0 0.5rem', '0', '0']}
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
                            Welcome Back!!
                        </Heading>

                        <Text>Please enter your credentials to log in</Text>

                        <FormControl
                            // border='1px solid red'
                            display='flex'
                            flexDir='column'
                            gap='0.75rem'
                            as='form'
                            onSubmit={onSignIn}
                        >
                            {/* Email Field */}

                            <FormControl isInvalid={errors.email}>
                                <Grid
                                    templateColumns='1fr 8fr'
                                    gap='2'
                                >
                                    <IconButton
                                        variant='unstyled'
                                        // border='1px solid teal'
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='center'
                                        cursor='default'
                                        icon={<MdOutlineEmail size='24' />}
                                    />
                                    <Flex
                                        flexDir='column'
                                    >
                                        <Input
                                            id='email'
                                            type='email'
                                            placeholder='Email'
                                            p='0.5rem'
                                            borderColor='#202020'
                                            focusBorderColor='#202020'
                                            _hover={{
                                                borderColor: '#202020'
                                            }}
                                            autoComplete='off'
                                            value={userDetails.email}
                                            onChange={hanldeInputChange}
                                        />
                                        <FormErrorMessage>Email is required.</FormErrorMessage>
                                    </Flex>
                                </Grid>
                            </FormControl>

                            {/* Password Field */}
                            <FormControl isInvalid={errors.password}>
                                <Grid
                                    templateColumns='1fr 8fr'
                                    gap='2'
                                >
                                    <IconButton
                                        variant='unstyled'
                                        // border='1px solid teal'
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='center'
                                        cursor='default'
                                        icon={<RiLockPasswordLine size='24' />}
                                    />
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
                                                value={userDetails.password}
                                                onChange={hanldeInputChange}
                                            />

                                            <InputRightElement className={loginStyle.eyeBtn}>
                                                <ButtonComp icon={isShow ? <FaRegEye /> : <FaEyeSlash />} clickHandler={setIsShow.toggle} />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage>
                                            {errors.passwordMessage}
                                        </FormErrorMessage>
                                    </Flex>
                                </Grid>
                            </FormControl>

                            <Box mt='1'>
                                <Text
                                    fontWeight='semibold'
                                    cursor='pointer'
                                >
                                    Forgot Password?
                                </Text>
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
                            >
                                <Text
                                    fontWeight='semibold'
                                    cursor='pointer'
                                >
                                    New to our platform?
                                </Text>
                                <Link
                                    to='/register'
                                    style={{
                                        color: '#0000ff'
                                    }}
                                >Sign Up</Link>
                            </Flex>

                            <Box mt='1' className={loginStyle.signInBtn}>
                                <ButtonComp type='submit' text='SIGN IN' />
                            </Box>
                        </FormControl>
                    </Flex>
                </Flex>

                {/* Right Side */}
                <Flex
                    // border='1px solid green'
                    display={{
                        base: 'none',
                        sm: 'none',
                        md: 'flex',
                        lg: 'flex'
                    }}
                >
                    <SignInOrSignUp navigateHandler={() => navigate('/register')} isSignUpPage={false} />
                </Flex>
            </Grid>
        </>
    );
};