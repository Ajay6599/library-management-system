const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { studAdminModel } = require('../Model/stud-admin.model');
const { blacklists } = require('../blacklists');
const mongoose = require('mongoose');

const studAdminController = {
    register: (req, res) => {
        const { name, gender, phoneNumber, email, password, confirmPassword, role } = req.body;

        try {
            if (password === confirmPassword) {
                bcrypt.hash(password, 10, async (err, hash) => {
                    if (err) {
                        return res.status(200).send({ msg: "Could't hash the password", Error: err });
                    } else {
                        let newUser = new studAdminModel({
                            name,
                            gender,
                            phoneNumber,
                            email,
                            password: hash,
                            confirmPassword: hash,
                            role
                        })
                        await newUser.save();
                        return res.status(200).send({ msg: "User has registered successfully." });
                    }
                });
            } else {
                return res.status(201).send({ msg: "Please correct your confirm password." });
            }
        } catch (error) {
            return res.status(400).send({ Error: error.message });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            let loginUser = await studAdminModel.findOne({ email }).select('+password');
            console.log(loginUser);
            if (!loginUser) {

                return res.status(401).send({ msg: "Invalid email or password." });

            } else {
                bcrypt.compare(password, loginUser.password, (err, result) => {

                    if (result) {

                        let token = jwt.sign({ id: loginUser._id.toString(), email: loginUser.email, role: loginUser.role, borrowedBooks: loginUser.borrowedBooks }, "libManSys", { expiresIn: "1h" });

                        return res.status(200).send({ msg: "Logged in successfully.", authToken: token, id: loginUser._id, name: loginUser.name, phoneNo: loginUser.phoneNumber, gender: loginUser.gender, email: loginUser.email, role: loginUser.role });

                    } else {
                        console.log("Error: ", err);
                        return res.status(401).send({ msg: "Invalid email or password." });

                    }

                })
            }
        } catch (error) {
            return res.status(500).send({ msg: " Server Error: ", error: error.message });
        }
    },
    getAllStudents: async (req, res) => {
        try {
            const allUsers = await studAdminModel.find();
            console.log(allUsers);
            const getStud = allUsers.filter((stud) => stud.role === 'Student');
            return res.status(201).send({ AllStudents: getStud });
        } catch (error) {
            return res.status(400).send({ Errors: error });
        }
    },
    getById: async (req, res) => {
        const { id } = req.params;

        try {
            const getUser = await studAdminModel.findById(id);
            return getUser.role === 'Admin' ? res.status(403).send({ msg: "Invalid user id, Please enter the valid user id" }) : res.status(200).send({ user: getUser });
        } catch (error) {
            return res.status(400).send({ msg: "Something Went Wrong while fetching the User", Error: error });
        }
    },
    updateByAdmin: async (req, res) => {
        const targetUserId = req.params.id;
        const loggedInUser = req.userAuth;
        const { role } = req.body;

        try {
            if (loggedInUser.role !== 'Admin') {
                return res.status(403).json({ msg: 'Access denied: Only admins can update roles' });
            }
            const userToUpdate = await studAdminModel.findById(targetUserId);
            if (!userToUpdate) {
                return res.status(404).send({ msg: "User not found" });
            }

            if (!role) {
                return res.status(400).json({ msg: 'No role provided to update' });
            }

            userToUpdate.role = role;
            await userToUpdate.save();

            return res.status(200).json({ msg: 'User role updated by admin successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ msg: "Something went wrong", err: error.message });
        }
    },
    updateBySelf: async (req, res) => {
        const loggedInUser = req.userAuth;
        const { name, phoneNumber, email, password, confirmPassword } = req.body;

        try {
            if (!mongoose.Types.ObjectId.isValid(loggedInUser.id)) {
                return res.status(400).send({ msg: "Invalid User ID format in token" });
            }
            const userToUpdate = await studAdminModel.findById(loggedInUser.id);
            if (!userToUpdate) {
                return res.status(404).send({ msg: "User not found" });
            }

            // Update personal details
            if (name) userToUpdate.name = name;
            // if (gender) userToUpdate.gender = gender;
            if (phoneNumber) userToUpdate.phoneNumber = phoneNumber;
            if (email && email !== userToUpdate.email) {
                const emailExists = await studAdminModel.findOne({ email });
                if (emailExists) {
                    return res.status(400).send({ msg: "Email already in use" });
                }
                userToUpdate.email = email;
            }

            // Handle password change if requested  
            if (password || confirmPassword) {
                if (password !== confirmPassword) {
                    return res.status(400).send({ msg: "Passwords do not match" });
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                userToUpdate.password = hashedPassword;
            }

            await userToUpdate.save();
            return res.status(200).send({ msg: "Profile Updated successfully" });

        } catch (error) {
            console.error(error);
            return res.status(500).send({ msg: "Something went wrong", err: error.message });
        }
    },
    deleteById: async (req, res) => {
        const { id } = req.params
        try {
            let user = await studAdminModel.findByIdAndDelete(id)
            return res.status(200).send({ msg: "User has deleted successfully", user: user })
        } catch (error) {
            return res.status(400).send({ msg: "Something Went Wrong while deleting the User", err: error })
        }
    },
    logout: async (req, res) => {
        const token = req.headers.authorization.split(" ")[1];

        try {
            if (blacklists.includes(token)) {
                return res.status(200).send({ msg: "You're already logged out." });
            }
            blacklists.push(token);
            console.log("Logged out successfully");
            return res.status(200).send({ msg: "Logged out successfully" });
        } catch (error) {
            return res.status(400).send({ msg: "Something Went Wrong While Logging out", error: error });
        }
    }
};

module.exports = { studAdminController };