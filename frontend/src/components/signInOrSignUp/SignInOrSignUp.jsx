import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { ButtonComp } from "../button/ButtonComp";
import { logoImg } from "../../assets/Assets";
import signInOrSignUpStyle from './SignInOrSignUp.module.css';
import { FaArrowRight } from "react-icons/fa6";

export const SignInOrSignUp = ({ navigateHandler, isSignUpPage }) => {

    // color: #5B35A4   #3778CC
    return (
        <Flex
            backgroundColor='#000'
            color='#fff'
            flexDir='column'
            alignItems='center'
            justifyContent='center'
            w='100%'
            borderBottomLeftRadius={isSignUpPage ? '0px': '40px'}
            borderTopLeftRadius={isSignUpPage ? '0px': '40px'}
            borderBottomRightRadius={isSignUpPage ? '40px': '0px'}
            borderTopRightRadius={isSignUpPage ? '40px': '0px'}
            gap='1rem'
        >
            <Image
                src={logoImg.logoName}
                alt="Logo"
                w='180px'
                // border='1px solid red'
            />

            <Text
                // border='1px solid white'
                fontWeight='light'
                mt='2rem'
            >
                {isSignUpPage ? 'Already have Account? Sign in now.' : 'New to our platform? Sign up now.'}
            </Text>

            <Box
                // border='1px solid red'
                className={signInOrSignUpStyle.btnContainer}
            >
                <ButtonComp text={isSignUpPage ? 'SIGN IN' : 'SIGN UP'} icon={<FaArrowRight />} clickHandler={navigateHandler} />
            </Box>
        </Flex>
    );
};