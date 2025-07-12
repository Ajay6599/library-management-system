import { Box, Checkbox, Divider, Flex, FormControl, FormLabel, Grid, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import { ButtonComp } from "../button/ButtonComp";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import adminStyle from "../../pages/adminDashboard/AdminDashboard.module.css";

export const Profile = () => {

    let { userDetails } = useContext(AuthContext);

    let { isOpen: isUpdatedModel, onOpen: openUpdateModel, onClose: closeUpdatedModel } = useDisclosure();

    const [show, setShow] = useState(false);
    const [confirmShow, setConfirmShow] = useState(false);

    let [name, setName] = useState("");
    let [gender, setGender] = useState("");
    let [phoneNumber, setPhoneNumber] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [confirmPassword, setConfirmPassword] = useState("");

    const genderHandler = (value) => {

        console.log(value);

        if (gender === value) {
            setGender('');
        } else {
            setGender(value);
        }
    };

    // let toast = useToast();

    const onSubmit = () => {

        if (!name || !gender || !phoneNumber || !email || !password || !confirmPassword) {
            alert('Please fill in all fields!');
            return;
        }

        // try {
        //     let res = await axios.post(`http://localhost:8080/users/register`, {
        //         name,
        //         gender,
        //         phoneNumber,
        //         email,
        //         password,
        //         confirmPassword
        //     });
        //     console.log(res.data);
        //     if (password !== confirmPassword) {
        //         toast({
        //             title: 'Account Not Created.',
        //             description: res.data.msg,
        //             status: 'error',
        //             duration: 5000,
        //             isClosable: true,
        //         });
        //         console.log(email, gender, phoneNumber, name, password, confirmPassword);
        //     } else {
        //         toast({
        //             title: 'Account Created.',
        //             description: res.data.msg,
        //             status: 'success',
        //             duration: 5000,
        //             isClosable: true,
        //         });
        //         console.log(email, gender, phoneNumber, name, password, confirmPassword);
        //         setName("");
        //         setGender("");
        //         setPhoneNumber("");
        //         setEmail("");
        //         setPassword("");
        //         setConfirmPassword("");
        //         navigate('/login');
        //     }
        // } catch (error) {
        //     console.log(error);
        //     toast({
        //         title: 'Something Went Wrong',
        //         description: error.msg,
        //         status: 'error',
        //         duration: 5000,
        //         isClosable: true,
        //     });
        // }

        console.log(email, gender, phoneNumber, name, password, confirmPassword);
    };

    return (
        <Flex border='1px solid white' h='100%' flexDir='column' justifyContent='space-evenly' alignItems='center'>
            <Box className={adminStyle.detailsContainer}>
                <Text fontSize='xl' color='#CD2571'>Name: <span>{userDetails.name}</span></Text>
                <Text fontSize='xl' color='#CD2571'>Email: <span>{userDetails.email}</span></Text>
                <Text fontSize='xl' color='#CD2571'>Gender: <span>{userDetails.gender}</span></Text>
                <Text fontSize='xl' color='#CD2571'>Mobile Number: <span>{userDetails.phoneNo}</span></Text>
            </Box>
            <Flex border='1px solid red' gap='4rem'>
                <Box className={adminStyle.editBtnContainer}>
                    <ButtonComp text='Edit' icon={<MdEdit size='20' />} clickHandler={openUpdateModel} />

                    {/* Update Model */}
                    <Modal isOpen={isUpdatedModel} onClose={closeUpdatedModel}>
                        <ModalOverlay />
                        <ModalContent
                            bgColor='#303030'
                            color='white'
                            minW='40%'
                        >
                            <ModalHeader
                                border='1px solid red'
                                justifyItems='center'
                            >
                                <Image
                                    src='https://cdn-icons-png.freepik.com/256/7767/7767245.png?ga=GA1.1.1611507755.1735198847&semt=ais_hybrid'
                                    alt='Logo'
                                    w='40px'
                                />
                                <Text
                                    fontWeight='light'
                                >
                                    Edit Profile
                                </Text>
                            </ModalHeader>

                            <ModalBody border='1px solid red' pl='6px' pr='6px'>

                                <FormControl border='1px solid #d3d3d3' rounded='md' p='10px' display='flex' flexDir='column' gap='16px' w='100%' isRequired>

                                    <Grid templateColumns='1fr 2fr' alignItems='center' mt='10px'>

                                        <FormLabel htmlFor="name" mt='1'>Name</FormLabel>
                                        <Input id="name" type="text" p='0 10px' autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />

                                    </Grid>

                                    <Grid templateColumns='1fr 2fr' alignItems='center'>
                                        <FormLabel htmlFor="gender" mt='1'>Gender</FormLabel>
                                        <Flex gap='1.25rem' mb='1'>
                                            <Checkbox value="Male" colorScheme="green" isChecked={gender === 'Male'} onChange={(e) => genderHandler(e.target.value)}>Male</Checkbox>
                                            <Checkbox value="Female" colorScheme="green" isChecked={gender === 'Female'} onChange={(e) => genderHandler(e.target.value)}>Female</Checkbox>
                                            <Checkbox value="Other" colorScheme="green" isChecked={gender === 'Other'} onChange={(e) => genderHandler(e.target.value)}>Other</Checkbox>
                                        </Flex>
                                    </Grid>

                                    <Grid templateColumns='1fr 2fr' alignItems='center'>
                                        <FormLabel htmlFor="phone" mt='1'>Mobile No.</FormLabel>
                                        <Input id="phone" type="tel" p='0 10px' maxLength={10} autoComplete="off" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                    </Grid>

                                    <Grid templateColumns='1fr 2fr' alignItems='center'>
                                        <FormLabel htmlFor="email" mt='1'>Email</FormLabel>
                                        <Input id="email" type="email" p='0 10px' autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </Grid>

                                    <Grid templateColumns='1fr 2fr' alignItems='center'>
                                        <FormLabel htmlFor="password" mt='1'>Password</FormLabel>
                                        <InputGroup>
                                            <Input id="password" type={show ? "text" : "password"} p='0 10px' autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <InputRightElement className={adminStyle.eyeButton}>
                                                <ButtonComp icon={show ? <FaRegEye /> : <FaRegEyeSlash />} clickHandler={() => setShow(!show)} />
                                            </InputRightElement>
                                        </InputGroup>
                                    </Grid>

                                    <Grid templateColumns='1fr 2fr' alignItems='center'>
                                        <FormLabel htmlFor="confirmPass" mt='1'>Confirm Password</FormLabel>
                                        <InputGroup>
                                            <Input id="confirmPass" type={confirmShow ? "text" : "password"} p='0 10px' autoComplete="off" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                            <InputRightElement className={adminStyle.eyeButton}>
                                                <ButtonComp icon={confirmShow ? <FaRegEye /> : <FaRegEyeSlash />} clickHandler={() => setConfirmShow(!confirmShow)} />
                                            </InputRightElement>
                                        </InputGroup>
                                    </Grid>

                                    <Grid className={adminStyle.loginBtn} templateColumns='1fr' justifyItems='center'>
                                        <ButtonComp type='submit' text='SUBMIT' clickHandler={onSubmit} />
                                    </Grid>

                                    <Divider />

                                    <Text fontSize='sm' textAlign='center'>
                                        &copy; {new Date().getFullYear()} Library Management System. All rights reserved.
                                    </Text>
                                </FormControl>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </Box>
                <Box className={adminStyle.delBtnContainer}>
                    <ButtonComp text='Delete Account' icon={<MdDelete size='20' />} />
                </Box>
            </Flex>
        </Flex>
    );
};