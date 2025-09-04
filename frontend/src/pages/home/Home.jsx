import { useContext, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContextProvider';
import { Box, Flex, Stack, useBoolean } from '@chakra-ui/react';
import { SideBar } from '../../components/sideBar/SideBar';
import { UserDashboard } from '../userDashboard/UserDashboard';
import { AdminDashboard } from '../adminDashboard/AdminDashboard';
import { Books } from '../../components/books/Books';
import { AddUserAdmin } from '../../components/addUserAdmin/AddUserAdmin';
import { Users } from '../../components/users/Users';
import { BorrowBook } from '../../components/borrowBook/BorrowBook';
import { Catalog } from '../../components/catalog/Catalog';
import { Profile } from '../../components/profile/Profile';

export const Home = () => {

    const redirectToLogin = true;

    let { isAuth, role } = useContext(AuthContext);
    // console.log(isAuth, role, userDetails);

    const navigate = useNavigate();
    const { component } = useParams();

    useEffect(() => {
        if (!component) {
            const basePath = role === 'Student' ? 'user' : 'admin';
            navigate(`/${basePath}/Dashboard`, { replace: true });
        }
    }, [component, navigate, role]);

    let [isSideBar, setIsSideBar] = useBoolean();

    if (redirectToLogin && !isAuth) {
        return <Navigate to='/login' />
    }

    const renderSelectedComponent = () => {
        switch (component) {
            case 'Dashboard':
                return role === 'Student' ? (
                    <UserDashboard />
                ) : (
                    <AdminDashboard />
                )
            case 'Books':
                return <Books />
            case 'Borrowed Books':
                return <BorrowBook />
            case 'Catalog':
                return <Catalog />
            case 'Users':
                return <Users />
            case 'Add New User':
                return <AddUserAdmin />
            case 'Profile':
                return <Profile />
            default:
                return role === 'Student' ? (
                    <UserDashboard />
                ) : (
                    <AdminDashboard />
                )
        }
    };

    return (
        <Stack
            // border='1px solid green'
            pos='realtive'
        >

            {/* Hamburger Menu Icon */}
            <Flex
                pos='absolute'
                right='2.5'
                top='2'
                bgColor='black'
                borderRadius='4px'
                cursor='pointer'
                zIndex='1100'
                display={['flex', 'flex', 'none', 'none']}
                onClick={setIsSideBar.toggle}
            >
                <Box
                    h='40px'
                    w='40px'
                    pos='relative'
                >
                    <Box
                        as='span'
                        h='5px'
                        w='84%'
                        pos='absolute'
                        top={isSideBar ? '50%' : '25%'}
                        left='50%'
                        transform={`translate(-50%, -50%) ${isSideBar ? 'rotate(45deg)' : ''}`}
                        backgroundColor='#fff'
                        borderRadius='20px'
                        transition='0.3s ease'
                        cursor='pointer'
                    ></Box>
                    <Box
                        as='span'
                        h='5px'
                        w='84%'
                        pos='absolute'
                        top='50%'
                        left='50%'
                        transform='translate(-50%, -50%)'
                        opacity={isSideBar && 0}
                        backgroundColor='#fff'
                        borderRadius='20px'
                        transition='0.3s ease'
                        cursor='pointer'
                    ></Box>
                    <Box
                        as='span'
                        h='5px'
                        w='84%'
                        pos='absolute'
                        top={isSideBar ? '50%' : '75%'}
                        left='50%'
                        transform={`translate(-50%, -50%) ${isSideBar ? 'rotate(-45deg)' : ''}`}
                        backgroundColor='#fff'
                        borderRadius='20px'
                        transition='0.3s ease'
                        cursor='pointer'
                    ></Box>
                </Box>
            </Flex>

            {/* Sidebar */}
            <SideBar isSideBarOpen={isSideBar} />


            {
                // (
                //     () => {
                //         switch (selectedComponent) {
                //             case 'Dashboard':
                //                 return role === 'Student' ? (
                //                     <UserDashboard />
                //                 ) : (
                //                     <AdminDashboard />
                //                 )
                //             case 'Books':
                //                 return <Books />
                //             case 'Borrowed Books':
                //                 return 'Borrowed Books';  // Replace with actual component if needed
                //             case 'Catalog':
                //                 return 'Catalog';  // Replace with actual Catalog component if needed
                //             case 'Users':
                //                 return <Users />
                //             case 'Add New User/Admin':
                //                 return <AddUserAdmin />
                //             default:
                //                 return role === 'Student' ? (
                //                     <UserDashboard />
                //                 ) : (
                //                     <AdminDashboard />
                //                 )
                //         }
                //     }
                // )()
                renderSelectedComponent()
            }
        </Stack>
    );
};