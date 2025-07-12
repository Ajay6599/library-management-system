import { Avatar, Box, Divider, Flex, Grid, Heading, IconButton, Image, ListItem, Stack, Text, Tooltip, UnorderedList } from "@chakra-ui/react";
import { Header } from "../../components/header/Header";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IoBookSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { GiClick } from "react-icons/gi";
import { logoImg } from "../../assets/Assets";
import { AuthContext } from "../../context/AuthContextProvider";

export const AdminDashboard = () => {

    let { userDetails } = useContext(AuthContext);

    let [allBookBorrowed, setAllBookBorrowed] = useState([]);
    let [usersCount, setUsersCount] = useState(0);
    let [adminCount, setAdminCount] = useState(0);

    let [borrowedAngle, setBorrowedAngle] = useState(0);
    let [returnedAngle, setReturnedAngle] = useState(0);

    let dashboardText = [
        {
            btnIcon: <FaUsers size='24' />,
            count: usersCount,
            btnText: 'Total Users Base'
        },
        {
            btnIcon: <IoBookSharp size='24' />,
            count: allBookBorrowed.length,
            btnText: 'Total Book Court'
        },
        {
            btnIcon: <GiClick size='24' />,
            count: adminCount,
            btnText: "Total Admin Court"
        },
    ];

    const fetchBorrowedBooks = async () => {
        let token = localStorage.getItem('authToken');

        try {
            // let res = await axios.get(`http://localhost:8080/borrows/all-borrowed-books`, {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // })

            let res = await axios.get(`${process.env.REACT_APP_API_URL}/borrows/all-borrowed-books`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            // console.log(res.data.borrowedBooks);
            setAllBookBorrowed(res.data.borrowedBooks);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAllUsers = async () => {
        let token = localStorage.getItem('authToken');

        try {
            // let res = await axios.get(`http://localhost:8080/users/`, {
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // });

            let res = await axios.get(`${process.env.REACT_APP_API_URL}/users/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // console.log("users", res.data.AllStudents);
            setUsersCount(res.data.AllStudents.filter(userRole => userRole.role === 'Student').length);
            setAdminCount(res.data.AllStudents.filter(userRole => userRole.role === 'Admin').length);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBorrowedBooks();
        fetchAllUsers();
    }, []);

    useEffect(() => {
        const returnBook = allBookBorrowed.filter(rb => rb.returnDate !== null);
        const noReturnBook = allBookBorrowed.filter(nrb => nrb.returnDate === null);

        const total = returnBook.length + noReturnBook.length;
        console.log("totalBook", total);
        if (total > 0) {
            const borrowedPercent = (noReturnBook.length / total) * 100;
            const returnedPercent = (returnBook.length / total) * 100;

            // Convert to angles for pie chart
            setBorrowedAngle((borrowedPercent / 100) * 360);
            setReturnedAngle((returnedPercent / 100) * 360);
        }
    }, [allBookBorrowed]);

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
                templateColumns={['1fr', '1fr', '1fr 2fr', '1fr 2fr']}
                h='100%'
                m='4rem 1rem 0'
                gap='1rem'
            >

                {/* Left Portion */}
                <Flex
                    // border='1px solid green'
                    flexDir='column'
                    justifyContent='space-around'
                    alignItems='center'
                    gap={['1rem', '1rem', '0', '0']}
                >
                    {/* PieChart with TextContent */}
                    <Flex
                        flexDir='column'
                        gap='1rem'
                        alignItems='center'
                    >
                        <Flex
                            border='1px solid'
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
                                    bgColor='#e0e0e0'
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
                            justifyContent='center'
                            // bg={`conic-gradient(#fff ${borrowedAngle}deg, #000 ${borrowedAngle}deg ${borrowedAngle + returnedAngle}deg, #ccc ${borrowedAngle + returnedAngle}deg)`}
                            bg={background}
                            pos='relative'
                        >
                            {/* <Tooltip label='Returned'>
                                <Box
                                    border='1px solid green'
                                    h='50%'
                                    pos='absolute'
                                ></Box>
                            </Tooltip>
                            <Tooltip label='Borrowed'>
                                <Box
                                    border='1px solid red'
                                    h='50%'
                                    pos='absolute'
                                    transform={`rotate(${borrowedAngle}deg)`}
                                    transformOrigin='center bottom'
                                ></Box>
                            </Tooltip> */}

                            {borrowedAngle > 0 && (
                                <Tooltip label={`Borrowed: ${allBookBorrowed.filter(b => b.returnDate === null).length}`}>
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
                                <Tooltip label={`Returned: ${allBookBorrowed.filter(b => b.returnDate !== null).length}`}>
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

                {/* Right Portion */}
                <Flex
                    // border='1px solid'
                    flexDir='column'
                    justifyContent='space-between'
                >
                    <Grid
                        templateColumns={['1fr', '1fr', '1fr', '1fr 2fr']}
                        gap='2rem'
                    >
                        <Flex
                            // border='1px solid'
                            flexDir='column'
                            gap='1rem'
                        >
                            {
                                dashboardText.map(({ btnIcon, count, btnText }, idx) => (
                                    <Flex
                                        key={idx}
                                        borderRadius='6px'
                                        bg='#fff'
                                        p='1rem 0.5rem'
                                        alignItems='center'
                                        justifyContent={['center', 'center', 'start', 'start']}
                                        gap={['1rem', '1rem', '0.75rem', '0.75rem']}
                                    >
                                        <IconButton icon={btnIcon} />
                                        <Divider orientation="vertical" borderColor='#000' borderWidth='1.5px' />
                                        <Flex
                                            flexDir='column'
                                            alignItems='center'
                                        >
                                            <Text>{count}</Text>
                                            <Text>{btnText}</Text>
                                        </Flex>

                                    </Flex>
                                ))
                            }
                        </Flex>

                        <Flex
                            flexDir='column'
                            alignItems='center'
                            justifyContent='center'
                            bg='#fff'
                            gap='0.5rem'
                            rounded='6px'
                            pt={['2rem', '2rem', '0', '0']}
                        >
                            <Avatar
                                name={userDetails.name}
                            />
                            <Heading
                                fontSize='2xl'
                            >
                                {userDetails.name}
                            </Heading>
                            <Text
                                p='0 2rem'
                                textAlign='center'
                            >
                                Welcome to your admin dashboard. Here you can managed all the settings and the monitor the statistics.
                            </Text>
                        </Flex>
                    </Grid>
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
            </Grid>
        </Stack>
    )
};
