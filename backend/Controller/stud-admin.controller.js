const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { studAdminModel } = require('../Model/stud-admin.model');
const { blacklists } = require('../blacklists');

const studAdminController = {
    register: (req, res) => {
        const { name, gender, phoneNumber, email, password, confirmPassword, role } = req.body;

        try {
            if (password === confirmPassword) {
                bcrypt.hash(password, 7, async (err, hash) => {
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

                        let token = jwt.sign({ id: loginUser._id, email: loginUser.email, role: loginUser.role, borrowedBooks: loginUser.borrowedBooks }, "libManSys", { expiresIn: "1h" });

                        return res.status(200).send({ msg: "Logged in successfully.", authToken: token, id: loginUser._id, name: loginUser.name, phoneNo: loginUser.phoneNumber, gender: loginUser.gender, email: loginUser.email, role: loginUser.role });

                    } else {
                        console.log("Error: ", err);
                        return res.status(401).send({ msg: "Invalid email or password." });

                    }

                })
            }
        } catch (error) {
            return res.status(500).send({msg: " Server Error: ", error: error.message});
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
            return getUser.role === 'Admin' ? res.status(403).send({msg: "Invalid user id, Please enter the valid user id"}) : res.status(200).send({user: getUser});
        } catch (error) {
            return res.status(400).send({ msg: "Something Went Wrong while fetching the User", Error: error});
        }
    },
    updateById: async (req, res) => {
        const { id } = req.params;

        try {
            // const getUser = await studAdminModel.findByIdAndUpdate(id);
            // getUser.role === 'Admin' && getUser._id === id ? : ;
            await studAdminModel.findByIdAndUpdate(id, req.body);
            return res.status(200).send({msg: "User details has updated successfully"});
        } catch (error) {
            return res.status(400).send({ msg: "Something Went Wrong while deleting the User", err: error });
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
            if(blacklists.includes(token)) {
                return res.status(200).send({msg: "You're already logged out."});
            }
            blacklists.push(token);
            console.log("Logged out successfully");
            return res.status(200).send({msg: "Logged out successfully"});
        } catch (error) {
            return res.status(400).send({msg:"Something Went Wrong While Logging out", error:error});
        }
    }
};

module.exports = { studAdminController };