# Workout Mate

A fitness tracking application that helps you monitor your exercise journey with a clean, intuitive interface.

---

## ✨ Features

- **Effective Sign-Up via Email Account**: Users can sign up with their valid email addresses, verified using EtherealMail or NodeMailer functionalities.
- **Profile Management**: Customize your username and profile picture.
- **Workout Tracking**: Log exercises with reps and weights.
- **Visual Progress**: Monitor your muscle group balance with an interactive donut chart.
- **Password Recovery**: Secure password reset system via email.
- **Data Control**: Download your data or manage your account settings.

---

## 📸 Screenshots

### 📨 Sign Up - Verify your account

![Email Verification](https://imgur.com/aHyM7VX.jpeg)
![Account Verified](https://i.imgur.com/m3npOux.jpeg)

Users can sign up with a valid email and strong password, then confirm their account via a link sent by email. After confirmation, they can log in. Invalid logins trigger an alert.

---

### 🏋️ Workout Dashboard

![Workout Dashboard](https://imgur.com/7X6nvIU.jpeg)

Click **"Buff It Up"** to add a workout with title, muscle group, reps, and load. Submitting valid inputs adds a timestamped workout card, sorted by newest. Each card includes edit ✏️ and delete 🗑️ options for easy management.

---

### ⚙️ Profile Settings

![Profile Settings](https://imgur.com/TIl2muw.jpeg)

Update your username and upload a custom, cropped profile image via the **"Profile Settings"** modal. Click **"Upload"** to save changes or **"X"** to close. You can also download your data or delete your account.

---

### 💾 Database Management

![Workouts Management - Mongoose](https://imgur.com/xczXPlL.jpeg)
![Users Management - Postgres](https://imgur.com/Rm2BwnD.jpeg)

Workout data is managed with MongoDB via Mongoose, while user accounts are handled using PostgreSQL, enabling efficient separation of structured and unstructured data.

---

### 🔐 Password Recovery

![Password Reset](https://imgur.com/dmcIOhN.jpeg)

Click **"Forgot the password?"** to request a reset link via email. Follow the link to set a new, strong password. Matching and secure entries will allow you to regain account access.

---

## 🛠️ Local Usage

1. Clone this repository
2. Create and populate `.env` file
3. Run this script on your Postgres database after creating the respective login/group role with its password:

```sql
CREATE TABLE wm_users (
    _id INT8 PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT (now()),
    email TEXT,
    password TEXT,
    username TEXT,
    profile_image TEXT,
    account_status TEXT DEFAULT ('pending')
);

CREATE TABLE account_confirmation (
    id INT8 PRIMARY KEY,
    user_id INT8,
    token TEXT,
    expires TIMESTAMPTZ DEFAULT (now() + '1 day'::interval)
);

CREATE TABLE password_reset (
    id INT8 PRIMARY KEY,
    user_id INT8,
    token TEXT,
    expires TIMESTAMPTZ DEFAULT (now() + '1 day'::interval)
);

-- Fix auto-increment for user IDs (Important for deployment) in the database's Query Tool shell
ALTER TABLE wm_users DROP COLUMN _id;
ALTER TABLE wm_users ADD COLUMN _id SERIAL PRIMARY KEY;
```

4. 🚀 In the backend directory after updating your .env file:

```bash
cd backend
npm install
npm run dev
```

5. 💻 In the frontend directory:

```bash
npm install
npm start
```

---

## ⚙️ Environment Variables <a name="environment-variables"></a>

To run the app locally, create a `.env` file in both the `frontend` and `backend` directories with the following variables:

### 🔙 Backend `.env`

**Mandatory:**

```
PG_USER=
PG_PASSWORD=
PG_HOST=
PG_DB=
MONGO_URI=
SECRET=
SALT=
# use ethereal email for these fields:
EMAIL_HOST=smtp.ethereal.email
EMAIL_USERNAME=
EMAIL_PASSWORD=
# OR you can use your preferred account:
EMAIL_SERVICE=gmail
EMAIL_USERNAME=yourgmail@gmail.com
EMAIL_PASSWORD=your_app_password
```

**Optional:**

```
# edit these ports as per your need, defaults are provided as follows:
PORT=6060
CLIENT_URL=localhost:3000
ORIGIN=http://localhost:3000
AUTH_TOKEN_EXPIRES_IN_MS=86400000
# database limits:
MAX_USERS=
MAX_WORKOUTS_PER_USER=
# rate limiters:
MAX_API_WORKOUTS_REQS=
MAX_API_USERS_REQS=
MAX_API_RESET_PASSWORD_REQS=
# rate limiter windows:
API_WORKOUTS_WINDOW_MS=
API_USERS_WINDOW_MS=
API_RESET_PASSWORD_WINDOW_MS=
# retry connections to db
MAX_RETRIES=
RETRY_DELAY_MS=
```

### 🖥️ Frontend `.env`

```
REACT_APP_API=
REACT_APP_WEB_SERVICE=localhost
```

---

## ⚠️ Note

If you are planning to deploy Gmail with an app password, update the code in `backend/src/middleware/sendEmail.js` as:

```
const transporter = nodemailer.createTransport({
  service: 'process.env.EMAIL_SERVICE',  // instead of process.env.EMAIL_HOST
  auth: {
    user: process.env.EMAIL_USERNAME, // your Gmail address
    pass: process.env.EMAIL_PASSWORD  // your Gmail app password
  }
});
```

> 🗃️ This is a demo app with limited storage capacity. Older entries may be automatically removed.

---

## 🧰 Tools and Dependencies [TECH STACK] <a name="tools"></a>

### 🔙 Backend

- NodeJS – Server logic
- Express – Routing
- MongoDB – NoSQL database for workouts
- PostgreSQL – Relational database for user accounts
- Mongoose – MongoDB object modeling
- Bcrypt – Password hashing
- Dotenv – Environment variable management
- Cors – Cross-origin resource sharing
- JWT – Authentication and session management
- Validator – Input validation
- Handlebars – Templating for emails
- Ethereal Email – Mock SMTP service for email testing
- Nodemailer – SMTP service for email verifications to email accounts for production level

#### 🧪 Dev Dependencies

- Jest – JavaScript testing framework
- MongoDB Memory Server – In-memory MongoDB instance for tests
- Shelf Jest MongoDB – Jest preset for MongoDB testing

---

### 🖥️ Frontend

- React – User interface framework
- React Router – Routing in the browser
- Redux – Global state management
- React Easy Crop – Image cropping utility
- Date-fns – Date formatting helpers
- ChartJS – Chart rendering library
- React ChartJS – React wrapper for ChartJS
- SASS – CSS preprocessor for styling

---

> 🚀 **Start tracking your fitness goals and visualizing your progress with Workout Mate!**
