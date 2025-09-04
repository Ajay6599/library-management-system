import { Avatar, Box, Divider, Flex, Grid, Heading, IconButton, Image, ListItem, Stack, Text, UnorderedList } from "@chakra-ui/react";
import { Header } from "../../components/header/Header";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { IoBookSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { GiClick } from "react-icons/gi";
import { logoImg } from "../../assets/Assets";
import { AuthContext } from "../../context/AuthContextProvider";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard = () => {

    let { userDetails } = useContext(AuthContext);

    let [allBookBorrowed, setAllBookBorrowed] = useState([]);
    let [usersCount, setUsersCount] = useState(0);
    let [adminCount, setAdminCount] = useState(0);

    let [borrowedBook, setBorrowedBook] = useState(0);
    let [returnedBook, setReturnedBook] = useState(0);

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
        const borrowed = allBookBorrowed.filter(rb => rb.returnDate !== null).length;
        const returned = allBookBorrowed.filter(nrb => nrb.returnDate === null).length;

        setBorrowedBook(borrowed)
        setReturnedBook(returned);

    }, [allBookBorrowed]);

    const chartData = [
        { name: 'Borrowed', value: borrowedBook },
        { name: 'Returned', value: returnedBook }
    ];

    const COLORS = ['#111', '#fff'];

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
                                    bgColor='#fff'
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
                        <ResponsiveContainer width='100%' height={250}>
                            <PieChart>
                                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8">
                                    {
                                        chartData.map((entry, index) => (
                                            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                                        ))
                                    }
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{
                                        padding: '0 6px',
                                        fontSize: '12px',
                                        top: '0',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
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
