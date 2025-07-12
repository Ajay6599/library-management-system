import { createContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [isAuth, setIsAuth] = useState(false);

    const [role, setRole] = useState(null);

    let [userDetails, setUserDetails] = useState({});

    const login = (token, name, phoneNo, gender, email) => {

        // Save the token in localStorage
        localStorage.setItem("authToken", token);
        // localStorage.setItem("userDetails", { name, phoneNo, gender, email });
        localStorage.setItem("userDetails", JSON.stringify({ name, phoneNo, gender, email }));
        setIsAuth(true);

        setUserDetails(
            {
                name,
                phoneNo,
                gender,
                email,
            }
        );

        // Extract and store the role from the decoded token
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role); // Assuming the role is stored in the token
        // console.log("decoded", decodedToken.role)
    };

    // console.log("userDetails", userDetails);
    // localStorage.setItem("userDetails", JSON.stringify(userDetails));

    const logout = () => {

        // Clear storage and authentication state
        localStorage.removeItem("authToken");
        localStorage.removeItem("userDetails");
        setIsAuth(false);
        setRole(null); // Clear the role
        setUserDetails({});

        // Redirect to login page
        window.location.href = "/login";
    };

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("authToken");
            const storedUserDetails = localStorage.getItem("userDetails");

            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decodedToken.exp > currentTime) {
                        setIsAuth(true);
                        setRole(decodedToken.role);
                        setUserDetails(JSON.parse(storedUserDetails));
                    } else {
                        logout(); // Token expired
                    }
                } catch (error) {
                    console.error("Error validating token:", error.message);
                    logout(); // Invalid token
                }
            }
        };

        // Check immediately
        checkToken();

        // Set interval to check token every 15 seconds
        const interval = setInterval(checkToken, 15000); // 15 seconds

        // Cleanup on unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuth, role, userDetails, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};