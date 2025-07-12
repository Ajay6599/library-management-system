import { Box, Divider, Flex, Grid, Image, ListItem, Stack, Text, Tooltip, UnorderedList } from "@chakra-ui/react";
import { Header } from "../../components/header/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import { ButtonComp } from "../../components/button/ButtonComp";
import { IoBookSharp } from "react-icons/io5";
import { PiKeyReturnBold } from "react-icons/pi";
import { GiClick } from "react-icons/gi";
import { logoImg } from "../../assets/Assets";
import userDashboardStyle from './UserDashboard.module.css';

export const UserDashboard = () => {

    let [userBookBorrowed, setUserBookBorrowed] = useState([]);

    let [borrowedAngle, setBorrowedAngle] = useState(0);
    let [returnedAngle, setReturnedAngle] = useState(0);

    let dashboardText = [
        {
            btnIcon: <IoBookSharp size='24' />,
            btnText: 'Your Borrowed Book List'
        },
        {
            btnIcon: <PiKeyReturnBold size='24' />,
            btnText: 'Your Returned Book List'
        },
        {
            btnIcon: <GiClick size='24' />,
            btnText: "Let's browse book inventory"
        },
    ];

    const fetchBorrowedBooks = async () => {
        let token = localStorage.getItem('authToken');

        try {
            // let res = await axios.get(`http://localhost:8080/borrows/user-borrowed-books`, {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // })

            let res = await axios.get(`${process.env.REACT_APP_API_URL}/borrows/user-borrowed-books`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            // console.log(res.data.borrowedBooks);
            setUserBookBorrowed(res.data.borrowedBooks);
            // setBorrowedAngle(45);
            // setReturnedAngle(90);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    useEffect(() => {
        const returnBook = userBookBorrowed.filter(rb => rb.returned === true);
        const noReturnBook = userBookBorrowed.filter(nrb => nrb.returned === false);

        // console.log(returnBook.length);
        // console.log(noReturnBook.length);

        const total = returnBook.length + noReturnBook.length;
        // console.log(total);

        if (total > 0) {
            const returnedPercent = (returnBook.length / total) * 100;
            const borrowedPercent = (noReturnBook.length / total) * 100;

            // Convert to angles for pie chart
            setBorrowedAngle((borrowedPercent / 100) * 360);
            setReturnedAngle((returnedPercent / 100) * 360);
        } else {
            setBorrowedAngle(0);
            setReturnedAngle(0);
        }
    }, [userBookBorrowed]);

    let background = '';

    if (returnedAngle === 360) {
        background = `conic-gradient(#a9a9a9 0deg 360deg)`; // All returned
    } else if (borrowedAngle === 360) {
        background = `conic-gradient(#000000 0deg 360deg)`; // All borrowed
    } else if (returnedAngle === 0 && borrowedAngle === 0) {
        background = `#e0e0e0`; // No data fallback
    } else {
        background = `conic-gradient(
        #a9a9a9 0deg ${returnedAngle}deg,
        #000000 ${returnedAngle}deg ${returnedAngle + borrowedAngle}deg,
        #e0e0e0 ${returnedAngle + borrowedAngle}deg 360deg
    )`;
    }


    return (
        <Stack
            // border='1px solid teal'
            ml={['0px', '0px', '220px', '220px']}
            overflowY={{
                base: 'auto',
                sm: 'auto',
            }}
            pos='relative'
            h='100vh'
        >
            <Header />

            <Grid
                // border='1px solid red'
                templateColumns={['1fr', '1fr', '2fr 1fr', '2fr 1fr']}
                h='100%'
                m='4rem 0.5rem 0'
                p='0.5rem 0 1rem'
                gap='1rem'
            >

                {/* Left Portion */}
                <Flex
                    // border='1px solid'
                    flexDir='column'
                    justifyContent='space-between'
                    order={['2', '1']}
                >
                    <Flex
                        // border='1px solid'
                        flexDir='column'
                        gap={['1rem', '1rem', '2rem', '2rem']}
                    >
                        {
                            dashboardText.map(({ btnIcon, btnText }, idx) => (
                                <Flex
                                    key={idx}
                                    borderRadius='6px'
                                    bg='#fff'
                                    p='1rem 0.5rem'
                                    alignItems='center'
                                    gap={['1rem', '1rem', '0.75rem', '0.75rem']}
                                    className={userDashboardStyle.dashboardBtns}
                                >
                                    <Divider orientation="vertical" borderColor='#000' borderWidth='1.5px' />
                                    <ButtonComp
                                        text={btnText}
                                        icon={btnIcon}
                                    />
                                </Flex>
                            ))
                        }
                    </Flex>
                    <Box
                        bg='#fff'
                        p='2rem'
                    >
                        <Text
                            fontSize='2xl'
                        >
                            "Embarking on the joureny of reading fosters personal growth, nuturing a path towards excellence and the refindment of character."
                        </Text>
                    </Box>
                </Flex>

                {/* Right Portion */}
                <Flex
                    flexDir='column'
                    justifyContent='space-around'
                    alignItems='center'
                    gap={['1rem', '1rem', '0', '0']}
                    order={['1', '2']}
                >
                    {/* PieChart with TextContent */}
                    <Flex
                        flexDir='column'
                        gap='1rem'
                        alignItems='center'
                    >
                        <Flex
                            // border='1px solid'
                            gap='0.75rem'
                        >
                            <Flex
                                alignItems='center'
                                gap='0.25rem'
                            >
                                <Box
                                    bgColor='#000'
                                    h='8px'
                                    w='24px'
                                ></Box>
                                <Text
                                    fontSize='sm'
                                >
                                    Total Borrowed Books
                                </Text>
                            </Flex>
                            <Flex
                                alignItems='center'
                                gap='0.25rem'
                            >
                                <Box
                                    bgColor='#a9a9a9'
                                    h='8px'
                                    w='24px'
                                ></Box>
                                <Text
                                    fontSize='sm'
                                >
                                    Total Returned Books
                                </Text>
                            </Flex>
                        </Flex>

                        {/* PieChart */}
                        <Flex
                            border='1px solid'
                            w='240px'
                            h='240px'
                            rounded='full'
                            alignItems='center'
                            justifyContent='center'
                            //                             bg={`conic-gradient(
                            //     #000000 0deg ${borrowedAngle}deg,
                            //     #a9a9a9 ${borrowedAngle}deg ${borrowedAngle + returnedAngle}deg
                            //   )`}
                            // bg={`conic-gradient(    #a9a9a9 0deg ${returnedAngle}deg,     #000000 ${returnedAngle}deg ${returnedAngle + borrowedAngle}deg,     #e0e0e0 ${returnedAngle + borrowedAngle}deg 360deg)`}
                            bg={background}
                            pos='relative'
                        >
                            {/* <Tooltip label={`Borrowed: ${userBookBorrowed.filter(b => !b.returned).length}`}>
                                <Box
                                    // border='1px solid green'
                                    pos="absolute"
                                    top="0"
                                    left="0"
                                    w="100%"
                                    h="100%"
                                    rounded='full'
                                    transform={`rotate(${borrowedAngle / 2}deg)`}
                                    transformOrigin="center"
                                    cursor="pointer"
                                ></Box>
                            </Tooltip>
                            <Tooltip label={`Returned: ${userBookBorrowed.filter(b => b.returned).length}`}>
                                <Box
                                    // border='1px solid red'
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    w="100%"
                                    h="100%"
                                    rounded='full'
                                    transform={`rotate(${borrowedAngle + returnedAngle / 2}deg)`}
                                    transformOrigin="center"
                                    cursor="pointer"
                                />
                            </Tooltip> */}
                            {borrowedAngle > 0 && (
                                <Tooltip label={`Borrowed: ${userBookBorrowed.filter(b => !b.returned).length}`}>
                                    <Box
                                        pos="absolute"
                                        top="0"
                                        left="0"
                                        w="100%"
                                        h="100%"
                                        rounded="full"
                                        transform={`rotate(${borrowedAngle / 2}deg)`}
                                        transformOrigin="center"
                                        cursor="pointer"
                                    />
                                </Tooltip>
                            )}

                            {returnedAngle > 0 && (
                                <Tooltip label={`Returned: ${userBookBorrowed.filter(b => b.returned).length}`}>
                                    <Box
                                        pos="absolute"
                                        top="0"
                                        left="0"
                                        w="100%"
                                        h="100%"
                                        rounded="full"
                                        transform={`rotate(${borrowedAngle + returnedAngle / 2}deg)`}
                                        transformOrigin="center"
                                        cursor="pointer"
                                    />
                                </Tooltip>
                            )}

                        </Flex>

                    </Flex>

                    <Flex
                        // border='1px solid red'
                        bg='#fff'
                        alignItems='center'
                        justifyContent={['center', 'center', 'start', 'start']}
                        gap='1rem'
                        p='1.25rem 0.75rem'
                        borderRadius='6px'
                        w='full'
                    >
                        <Flex
                            // borderRight='1px solid'
                            alignItems='center'
                            justifyContent='center'
                        >
                            <Image
                                src={logoImg.logo}
                                alt='Logo'
                                w='50px'
                            />
                        </Flex>
                        <Divider orientation="vertical" borderColor="#000" borderWidth='1.5px' />
                        <Flex>
                            <UnorderedList>
                                <ListItem>Total Borrowed Books</ListItem>
                                <ListItem>Total Returned Books</ListItem>
                            </UnorderedList>
                        </Flex>
                    </Flex>
                </Flex>
            </Grid>
        </Stack>
    )
};
