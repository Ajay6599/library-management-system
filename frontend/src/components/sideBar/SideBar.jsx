import { Box, Flex, Image } from "@chakra-ui/react";
import { logoImg } from "../../assets/Assets";
import { ButtonComp } from "../button/ButtonComp";
import { MdDashboard, MdLibraryBooks, MdLogout } from "react-icons/md";
import { SiBookstack } from "react-icons/si";
import { FaUser, FaUserPlus, FaUsers } from "react-icons/fa";
import sideBarStyle from './SideBar.module.css';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { GrCatalogOption } from "react-icons/gr";

export const SideBar = ({ isSideBarOpen }) => {

    let { role, logout } = useContext(AuthContext);

    const onLogout = async () => {
        let token = localStorage.getItem("authToken");

        // let res = await axios.get(`http://localhost:8080/users/user/logout`, {
        //     headers: {
        //         'Authorization': `bearer ${token}`
        //     }
        // });

        let res = await axios.get(`${process.env.REACT_APP_API_URL}/users/user/logout`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(res);

        logout();
    };

    let { component } = useParams();
    // console.log(component);

    let navigate = useNavigate();

    const componentHandler = (component) => {
        const basePath = role === 'Student' ? 'user' : 'admin'
        navigate(`/${basePath}/${component}`);
    };

    return (
        <Flex
            backgroundColor='#000'
            color='#fff'
            flexDir='column'
            alignItems='center'
            justifyContent='space-between'
            h='100vh'
            w='220px'
            pos='fixed'
            top='0'
            left={{
                base: isSideBarOpen ? '0px' : '-220px',
                sm: isSideBarOpen ? '0px' : '-220px',
                md: '0px',
                lg: '0px',
            }}
            zIndex='1100'
            transition='all 0.5s linear'
        >

            <Flex
                flexDir='column'
                alignItems='center'
                gap='1rem'
            >
                {/* Logo Image */}
                <Box
                // border='1px solid red'
                >
                    <Image
                        src={logoImg.logoName}
                        alt='Logo'
                        w='180px'
                    />
                </Box>

                {/* User or Admin Button */}
                <Flex
                    // border='1px solid green'
                    flexDir='column'
                    gap='0.5rem'
                    className={sideBarStyle.btnsContainer}
                >
                    <ButtonComp
                        text='Dashboard'
                        icon={<MdDashboard size='18' />}
                        clickHandler={() => componentHandler('Dashboard')}
                        isActive={component === 'Dashboard'}
                    />
                    <ButtonComp
                        text='Books'
                        icon={<SiBookstack size='18' />}
                        clickHandler={() => componentHandler('Books')}
                        isActive={component === 'Books'}
                    />
                    {
                        role === 'Student' && (
                            <>
                                <ButtonComp
                                    text='Borrowed Books'
                                    icon={<MdLibraryBooks size='18' />}
                                    clickHandler={() => componentHandler('Borrowed Books')}
                                    isActive={component === 'Borrowed Books'}
                                />
                            </>
                        )
                    }

                    {
                        role === 'Admin' && (
                            <>
                                <ButtonComp
                                    text='Catalog'
                                    icon={<GrCatalogOption size='18' />}
                                    clickHandler={() => componentHandler('Catalog')}
                                    isActive={component === 'Catalog'}
                                />
                                <ButtonComp
                                    text='Users'
                                    icon={<FaUsers size='18' />}
                                    clickHandler={() => componentHandler('Users')}
                                    isActive={component === 'Users'}
                                />
                                <ButtonComp
                                    text='Add New User/Admin'
                                    icon={<FaUserPlus size='18' />}
                                    clickHandler={() => componentHandler('Add New User')}
                                    isActive={component === 'Add New User'}
                                />
                            </>
                        )
                    }
                    <ButtonComp
                        text='Profile'
                        icon={<FaUser size='18' />}
                        clickHandler={() => componentHandler('Profile')}
                        isActive={component === 'Profile'}
                    />
                </Flex>
            </Flex>

            {/* Logout Button */}
            <Box
                // border='1px solid green'
                mb='1rem'
                className={sideBarStyle.btnsContainer}
            >
                <ButtonComp text='Logout' icon={<MdLogout size='18' />} clickHandler={onLogout} />
            </Box>
        </Flex>
    );
};