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
        const { username, email, password } = req.body;

        // Kiểm tra xem có người dùng với username hoặc email trùng không
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) {
            return res.status(400).json({ message: 'Tài khoản đã tồn tại.' });
        }

        // Hash mật khẩu
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Tạo người dùng mới với mật khẩu đã hash
        const newUser = new User({
            ...req.body,
            password: hashedPassword
        });

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
        
        // Find user by ID from the token and update the specified fields
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId, // lấy userId từ token giải mã trong middleware
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


// Update user information
exports.updatePage = async (req, res) => {
    try {
        const { mssv, number_pager } = req.body;
        
        // Find user by ID from the token and update the specified fields
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId, // lấy userId từ token giải mã trong middleware
            { mssv, number_pager },
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
        const user = await User.findOne({ username });

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

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục avatars tồn tại
const avatarsDir = 'Frontend/public/avatars';
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Cấu hình multer để lưu tệp vào thư mục public/avatars
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarsDir);  // Lưu vào thư mục avatars
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Đặt tên tệp là thời gian hiện tại + phần mở rộng
  }
});

const upload = multer({ storage: storage });

// Hàm xử lý tải lên avatar
exports.uploadAvatar = async (req, res) => {
  upload.single('avatar')(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error uploading file');
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const avatarUrl = `/avatars/${req.file.filename}`;

    try {
      const userId = req.user.userId;  // Assuming req.user contains the authenticated user info
      if (!userId) {
        return res.status(401).send('User not authenticated');
      }

      // Query the user by ID to ensure we are working with a Mongoose instance
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send('User not found');
      }

      // Check if the user already has an avatar and delete the old one if it exists
      if (user.avatar) {
        console.log("delete")
        const oldAvatarPath = path.join(avatarsDir, user.avatar.replace('/avatars/', ''));
        // Check if the old avatar file exists and delete it
        console.log(oldAvatarPath)
        if (fs.existsSync(oldAvatarPath)) {
          try {
            fs.unlinkSync(oldAvatarPath);  // Xóa file cũ
            console.log('Deleted old avatar:', oldAvatarPath);
          } catch (error) {
            console.error('Error deleting old avatar:', error);
          }
        } else {
          console.log('No old avatar file to delete:', oldAvatarPath);
        }
      }


      // Update the avatar URL for the user
      user.avatar = avatarUrl;
      await user.save();  // Save the updated user

      res.json(user);  // Send back the updated user info with the new avatar
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating avatar');
    }
  });
};
