import { Box, Divider, Flex, Grid, Image, ListItem, Stack, Text, UnorderedList } from "@chakra-ui/react";
import { Header } from "../../components/header/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import { ButtonComp } from "../../components/button/ButtonComp";
import { IoBookSharp } from "react-icons/io5";
import { PiKeyReturnBold } from "react-icons/pi";
import { GiClick } from "react-icons/gi";
import { logoImg } from "../../assets/Assets";
import userDashboardStyle from './UserDashboard.module.css';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export const UserDashboard = () => {

    let [userBookBorrowed, setUserBookBorrowed] = useState([]);

    let [returnBook, setReturnBook] = useState(0);
    let [noReturnBook, setNoReturnBook] = useState(0);

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
            setUserBookBorrowed(res.data.borrowedBooks);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    useEffect(() => {
        const returned = userBookBorrowed.filter(rb => rb.returned === true).length;
        const notReturned = userBookBorrowed.filter(rb => rb.returned === false).length;
        setReturnBook(returned);
        setNoReturnBook(notReturned);
    }, [userBookBorrowed]);

    const chartData = [
        { name: 'Returned', value: returnBook },
        { name: 'Not Returned', value: noReturnBook }
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
