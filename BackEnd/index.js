require("./passport");
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const authModel = require("./Models/Model");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const TodoRoutes = require("./Routes/TodoRoutes");
const NoteRoutes = require("./Routes/NoteRoutes");
const TaskRoutes = require("./Routes/TaskRoutes");


const app=express()
const PORT = 5000;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET","POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  collectionName: "sessions",
});

sessionStore.on("error", (err) => {
  console.error("SESSION STORE ERROR:", err);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);



app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json(" hello ");
});



app.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await authModel.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new authModel({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "Registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });
      return res.json({ success: true, user });
    });
  })(req, res, next);
});


app.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) res.send(err);
    else res.json({ success: "logged out" });
  });
});

app.get("/getUser", (req, res, next) => {
  if (req.user) {
    res.json(req.user);
  }
});


app.post("/resetPassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(id);
  const { newPassword } = req.body;
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, encode) => {
    if (err) return res.send({ Status: "Try again after few minutes" });
    else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      authModel
        .findByIdAndUpdate({ _id: id }, { password: hashedPassword })
        .then((u) => res.send({ Status: "success" }))
        .catch((err) => res.send({ Status: err }));
    }
  });
});



app.post("/forgotpass", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await authModel.findOne({ email });
    if (!user) return res.status(404).json({ Status: "error", message: "Enter a valid registered email" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset - Task Manager",
      text: `Click the link to reset your password: ${process.env.FRONTEND_DOMAIN}/ResetPass/${user._id}/${token}`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ Status: "success", message: "Reset link sent successfully" });
  } catch (error) {
    console.error("Error in forgot password route:", error);
    return res.status(500).json({ Status: "error", message: "Internal Server Error" });
  }
});
``

const authenticator = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Login Required" });
  }
  next();
};
app.use("/todo", [authenticator, TodoRoutes]);
app.use("/note", [authenticator, NoteRoutes]);
app.use("/task", [authenticator, TaskRoutes]);

/*app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log("Backend route found:", r.route.path);
  }
});*/


app.listen(5000, () => {
  console.log("Server Running On Port : 5000");
});

module.exports = app;
