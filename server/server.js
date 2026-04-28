import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import pgSession from "connect-pg-simple";
import cookieParser from "cookie-parser";
import env from "dotenv";
import cors from "cors";
import crypto from "crypto";
import nodemailer from "nodemailer";
import validator from "validator";

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

const app = express();

// Needed for CORS policy to allow requests from client
app.use(cors(corsOptions));

const cookieOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secure: false, // Must be false for local HTTP
  sameSite: 'lax', // Allows the cookie to be sent after the Google redirect
  httpOnly: true
}

const port = 3000;
const saltRounds = 10;
env.config();

const pgPool = new pg.Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false // This allows the self-signed certificate from AWS
  }
})

const PostgresStore = pgSession(session);

app.use(cookieParser());

app.use(
  session({
    store: new PostgresStore({
      pool : pgPool,
      tableName : 'user_sessions',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: cookieOptions,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

// Setup email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify gmail connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("Nodemailer verification error:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/auth/google", passport.authenticate("google", { 
  scope: ["profile", "email"] 
}));


app.get("/auth/google/davishousesports", 
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    // Successful authentication, redirect to REACT app's home page
    res.redirect("http://localhost:5173/home");
  }
);

app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    // Handle error
    if (err) { 
      console.log('Error during authentication:', err);
      return next(err); 
    }

    if (!user) {
      // 'info.message' comes from LocalStrategy (e.g., "User not found")
      return res.status(401).json({ 
        message: info.message || "Authentication failed" 
      });
    }

    // Handle Login Success
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      
      console.log('Login success.');
      return res.json(user);
    });

  })(req, res, next); // This invokes the middleware
});

app.post('/api/logout', (req, res, next) => {
  req.logout((err) => {
    console.log('Logging out.');
    if (err) { 
      return next(err); 
    }
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.status(200).send('Logged out');
    });
  });
});

// This route is called by your React useEffect on app load
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    // res.json(req.user) sends the user object back to your React state
    res.json(req.user); 
  } else {
    // 401 Unauthorized tells React there is no active session
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.post("/api/register", async (req, res) => {
  // Destructure all three fields from your React formData
  const { email, username, password } = req.body; 

  const cleanEmail = validator.normalizeEmail(email);

  if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    // Check if EITHER email or username is already taken
    const checkResult = await pgPool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2", 
      [cleanEmail, username]
    );

    if (checkResult.rows.length > 0) {
      // Check which one specifically failed to give a better error message
      const existingUser = checkResult.rows[0];
      const conflict = existingUser.email === cleanEmail ? "Email" : "Username";
      return res.status(409).json({ message: `${conflict} already registered.` });
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Security error" });
      }

      // INSERT all three fields
      const result = await pgPool.query(
        "INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *",
        [cleanEmail, hash, username]
      );

      const user = result.rows[0];
      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login failed" });
        console.log("Registration and login success");
        // Return the whole user object so React context gets the username
        res.json(user); 
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error during registration" });
  }
});

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await pgPool.query("SELECT * FROM users WHERE email = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false, { message: "Incorrect password." });
            }
          }
        });
      } else {
        return cb(null, false, { message: "User not found." });
      }
    } catch (err) {
      console.error("Database error during login:", err);
      return cb(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/davishousesports",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails[0].value;

        const result = await pgPool.query("SELECT * FROM users WHERE email = $1", [
          email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await pgPool.query(
            "INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *",
            [email, "google", null]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        console.error("Google Strategy Error:", err);
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userId = parseInt(id, 10); 
    // Explicitly select the columns you want to send to the frontend
    const result = await pgPool.query(
      "SELECT id, email, username FROM users WHERE id = $1", 
      [userId]
    );
    
    done(null, result.rows[0]); 
  } catch (err) {
    console.error("Deserialization error:", err);
    done(err);
  }
});

app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await pgPool.query("SELECT * FROM users WHERE email = $1", [email]);

    try {
      if (user.rows.length === 0) {
          return res.status(404).json({ message: "User not found" });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      
      const hashedToken = await bcrypt.hash(resetToken, saltRounds);
      
      // 1 Hour
      const expiry = new Date(Date.now() + 3600000); 

      await pgPool.query(
          "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3",
          [hashedToken, expiry, email]
      );

      const resetLink = `http://localhost:5173/reset-password/${resetToken}?email=${email}`;

      // Send the actual email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset.</p>
                <p>Click the link below to set a new password. This link expires in 1 hour:</p>
                <a href="${resetLink}">${resetLink}</a>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Reset link sent to your email!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error sending email." });
    }
});

app.post("/api/reset-password", async (req, res) => {
    const { email, token, newPassword } = req.body;

    try {
        // 1. Find the user by email
        const result = await pgPool.query(
            "SELECT reset_token, reset_token_expiry FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid request or user not found." });
        }

        const { reset_token, reset_token_expiry } = result.rows[0];

        // 2. Check if the token has expired
        // Postgres TIMESTAMPTZ is automatically converted to a JS Date object by 'pg'
        if (new Date() > reset_token_expiry) {
            return res.status(400).json({ message: "Reset link has expired." });
        }

        // 3. Verify the token using bcrypt
        // Remember: 'token' is the raw string from the URL, 'reset_token' is the hash in DB
        const isTokenValid = await bcrypt.compare(token, reset_token);

        if (!isTokenValid) {
            return res.status(400).json({ message: "Invalid or tampered reset token." });
        }

        // 4. Token is valid! Hash the NEW password
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // 5. Update the user and CLEAR the reset fields so the link can't be reused
        await pgPool.query(
            "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE email = $2",
            [hashedNewPassword, email]
        );

        res.json({ message: "Password successfully updated. You can now login." });

    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ message: "An error occurred during password reset." });
    }
});

app.post("/api/update-profile", async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
  
  const { username } = req.body;
  const userId = req.user.id;

  try {
    const nameCheck = await pgPool.query("SELECT id FROM users WHERE username = $1", [username]);
    if (nameCheck.rows.length > 0) {
      return res.status(409).json({ message: "Username already taken." });
    }

    const result = await pgPool.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING *",
      [username, userId]
    );
    
    // Update the session user object
    req.login(result.rows[0], (err) => {
      if (err) return res.status(500).send("Session update failed");
      res.json(result.rows[0]);
    });
  } catch (err) {
    res.status(500).send("Database error");
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
