const { users } = require("../data/store");


// Create a new user
const createUser = (req, res) => {
  const { name, email } = req.body;

  // Validate input
  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required",
    });
  }


  // Check whether user already exists
  const existingUser = [...users.values()].find(
    (user) => user.email === email
  );

  if (existingUser) {
    return res.status(400).json({
      message: "User with this email already exists",
    });
  }


  // Generate a simple ID
  const id = Date.now().toString();


  // Create user object
  const user = {
    id,
    name,
    email,
  };


  // Store user
  users.set(id, user);


  // Send response
  res.status(201).json({
    message: "User created successfully",
    user,
  });
};



// Login user
const loginUser = (req, res) => {
  const { email } = req.body;


  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }


  // Find user
  const user = [...users.values()].find(
    (user) => user.email === email
  );


  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }


  // Mock login
  res.json({
    message: "Login successful",
    user,
  });
};



// Get all users
const getAllUsers = (req, res) => {

  const allUsers = [...users.values()];

  res.json({
    users: allUsers,
  });
};



module.exports = {
  createUser,
  loginUser,
  getAllUsers,
};