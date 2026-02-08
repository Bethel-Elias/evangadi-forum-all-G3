const { db, auth } = require("../firebase-admin-config");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// Check if Firebase Admin SDK is initialized
function isFirebaseInitialized() {
  return db && auth;
}

// Register - Create user with Firebase Auth and save to Firestore (or fallback)
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  if (password.length <= 8) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Password must be at least 8 characters" });
  }

  // Fallback if Firebase is not initialized
  if (!isFirebaseInitialized()) {
    console.warn("Firebase not initialized, using fallback registration");
    const mockUserId = `mock_${Date.now()}`;
    const token = jwt.sign(
      { userid: mockUserId, username },
      process.env.DB_JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res
      .status(StatusCodes.CREATED)
      .json({
        msg: "User registered successfully (Firebase fallback mode)",
        token,
        user: {
          userid: mockUserId,
          username,
          email,
        },
      });
  }

  try {
    // Check if user already exists in Firestore
    const userDoc = await db.collection("users").where("email", "==", email).get();
    if (!userDoc.empty || await checkUserExistsByUsername(username)) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "User already existed" });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    // Hash password for additional security (optional but recommended)
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    // Save user data to Firestore
    await db.collection("users").doc(userRecord.uid).set({
      username,
      firstname,
      lastname,
      email,
      password: hashedpassword,
      createdAt: new Date(),
    });

    // Create JWT token
    const token = jwt.sign(
      { userid: userRecord.uid, username },
      process.env.DB_JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res
      .status(StatusCodes.CREATED)
      .json({
        msg: "User registered successfully",
        token,
        user: {
          userid: userRecord.uid,
          username,
          email,
        },
      });
  } catch (error) {
    console.error("Registration error:", error.message);
    if (error.code === "auth/email-already-exists") {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "Email already exists" });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred during registration" });
  }
}

// Login - Authenticate with Firebase Auth (or fallback)
async function login(req, res) {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  // Fallback if Firebase is not initialized
  if (!isFirebaseInitialized()) {
    console.warn("Firebase not initialized, using fallback login");
    const mockUserId = `mock_${Date.now()}`;
    const token = jwt.sign(
      { userid: mockUserId, username: email.split('@')[0] },
      process.env.DB_JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res
      .status(StatusCodes.OK)
      .json({ 
        msg: "User login successful (Firebase fallback mode)", 
        token, 
        username: email.split('@')[0] 
      });
  }

  try {
    // In a real scenario, you'd verify the password with Firebase Auth
    // For this implementation, we'll check user exists in Firestore and verify password
    const userQuery = await db.collection("users").where("email", "==", email).get();
    
    if (userQuery.empty) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid email or password" });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    
    // Verify password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userid: userDoc.id, username: userData.username },
      process.env.DB_JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res
      .status(StatusCodes.OK)
      .json({ msg: "User login successful", token, username: userData.username });
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred during login" });
  }
}

// Check user validity
async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Valid user", username, userid });
}

// Helper function to check if username exists
async function checkUserExistsByUsername(username) {
  const querySnapshot = await db.collection("users").where("username", "==", username).get();
  return !querySnapshot.empty;
}

module.exports = { register, login, checkUser };
