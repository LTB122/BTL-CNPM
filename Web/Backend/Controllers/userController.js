const User = require('../Models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hàm lấy thông tin một người dùng dựa vào username hoặc email từ token
exports.getOneUser = async (req, res) => {
    try {
        // Lấy username hoặc email từ `req.user` được middleware gắn vào
        const { username, email } = req.user;

        // Tìm người dùng theo username hoặc email
        const user = await User.findOne({ $or: [{ username }, { email }] }).select('-password'); // Loại bỏ password

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Trả về thông tin người dùng
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const bcrypt = require('bcrypt');

// Tạo người dùng mới
exports.createUser = async (req, res) => {
    try {
        // Kiểm tra xem có người dùng với username là 'admin' chưa
        const existingAdmin = await User.findOne({ username: 'admin' });

        if (existingAdmin) {
            return res.status(400).json({ message: 'Tài khoản admin đã tồn tại.' });
        }

        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Update user information
exports.updateUser = async (req, res) => {
    try {
        const { name, mssv, sdt, email, avatar } = req.body;

        // Find user by ID and update the specified fields
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, mssv, sdt, email, avatar },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const jwt = require('jsonwebtoken');

// Login a user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username or email (you can choose either one)
        const user = await User.findOne({ $or: [{ username }, { email: username }] });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token (using the secret from .env)
        const token = jwt.sign(
            { userId: user._id, username: user.username },  // Payload
            process.env.AUTH,  // Use the secret key from .env
            { expiresIn: '1h' }  // Token expiration time (1 hour in this case)
        );

        // Send the token in the response
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

