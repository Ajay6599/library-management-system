// Middleware/canEditOrDeleteUser.js
const canEditOrDeleteUser = (req, res, next) => {
    const loggedInUser = req.userAuth;
    const targetUserId = req.params.id;

    if (loggedInUser.role === 'Admin') {
        // Admin can do anything
        return next();
    }

    if (loggedInUser.role === 'Student' && loggedInUser._id === targetUserId) {
        // Student can only update/delete self
        return next();
    }

    return res.status(403).json({ msg: "You are not authorized to perform this action" });
};

module.exports = { canEditOrDeleteUser };
