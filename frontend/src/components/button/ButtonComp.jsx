import { Box, Button, Text } from "@chakra-ui/react";

export const ButtonComp = ({ type, text, icon, clickHandler, isActive }) => {
    return (
        <Button
            type={type}
            variant='unstyled'
            borderRight={isActive ? '2px solid #fff' : '2px solid transparent'}
            position='relative'
            onClick={clickHandler}
        >

            <Box position='absolute'>
                {icon}
            </Box>

            <Text>{text}</Text>

        </Button>        
    );
};