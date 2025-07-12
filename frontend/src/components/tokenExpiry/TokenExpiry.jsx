import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import { jwtDecode } from 'jwt-decode';
import { Box } from "@chakra-ui/react";

export const TokenExpiry = () => {

    let { logout } = useContext(AuthContext);
    const [countDown, setCountDown] = useState(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const checkTokenExpiry = () => {
            const token = localStorage.getItem("authToken");

            if(token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const currentTime = Date.now() / 1000; // Current time in seconds
                    const remainingTime = decodedToken.exp - currentTime; // Time left until token expiration

                    if (remainingTime <= 0) {
                        setIsExpired(true);
                        logout();
                    } else if (remainingTime <= 60) {
                        // Start countdown when 1 minute or less is left

                        setCountDown(Math.floor(remainingTime));

                        const countdownInterval = setInterval(() => {
                            setCountDown((prev) => {
                                if(prev <= 1) {
                                    clearInterval(countdownInterval); // Clear interval when countdown reaches 0
                                    return null; // Stop countdown
                                }
                                return prev - 1; // Decrement countdown every second
                            })
                        }, 1000); // Update countdown every second
                    }
                } catch (error) {
                    console.error("Error decoding token:", error);
                    logout(); // Handle invalid token
                }
            }
        };

        // Call the function to check token expiration on component mount
        checkTokenExpiry();

        // Optionally, you can check periodically (e.g., every minute)
        const interval = setInterval(checkTokenExpiry, 60000); // Check every minute

        // Cleanup on unmount
        return () => {
            clearInterval(interval);
        };

    }, [logout]);

    return (
        <>
            {
                countDown !== null &&  countDown > 0 && !isExpired && (
                    <Box pos='fixed' bottom='10px' left='10px' bg="red.900" color="white" p="10px" borderRadius="md" boxShadow="lg" fontSize="lg" fontWeight="bold" opacity=".9">
                        Session will expire in {countDown} seconds
                    </Box>
                )
            }
        </>
    );
};