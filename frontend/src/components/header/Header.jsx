import { Flex, Grid, Icon, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContextProvider";

export const Header = () => {

    const { userDetails, role } = useContext(AuthContext);

    let [currentDate, setCurrentDate] = useState('');
    let [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateDateTime = () => {
            const dateOptions = {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                timeZone: 'Asia/Kolkata'
            };
            const timeOptions = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            };

            // Get date and time
            setCurrentDate(new Date().toLocaleString('en-IN', dateOptions));
            setCurrentTime(new Date().toLocaleString('en-IN', timeOptions));
        }

        updateDateTime();

        const intervalId = setInterval(updateDateTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Flex
            // border='1px solid teal'
            justifyContent='space-between'
            alignItems='center'
            p='0.25rem 0.5rem'
            bgColor='#fff'
            boxShadow='0px 1px 2px 1px #808080'
            pos={['fixed', 'fixed', 'absolute', 'absolute']}
            top='0'
            left='0'
            w='100%'
            zIndex='1000'
        >
            <Grid
                // border='1px solid'
                templateColumns='40px 1fr'
                alignItems='center'
            >
                <Icon
                    as={FaUser}
                    w='24px'
                    h='24px'
                    // border='1px solid red'
                />
                <Flex
                    // border='1px solid darkGreen'
                    flexDir='column'
                >
                    <Text
                        fontWeight='semibold'
                        fontSize='lg'
                    >
                        {userDetails.name}
                    </Text>
                    <Text
                        fontSize='sm'
                    >
                        {role}
                    </Text>
                </Flex>
            </Grid>

            <Flex
                flexDir='column'
                display={['none', 'none', 'flex', 'flex']}
            >
                <Text
                    fontSize='sm'
                >
                    {currentTime}
                </Text>
                <Text
                    fontSize='sm'
                >
                    {currentDate}
                </Text>
            </Flex>
        </Flex>
    );
}