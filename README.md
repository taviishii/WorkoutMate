# Workout Mate
A fitness tracking application that helps you monitor your exercise journey with a clean, intuitive interface.

## Features
- **Profile Management**: Customize your username and profile picture
- **Workout Tracking**: Log exercises with reps and weights
- **Visual Progress**: Monitor your muscle group balance with an interactive donut chart
- **Password Recovery**: Secure password reset system via email
- **Data Control**: Download your data or manage your account settings

## Screenshots

### Workout Dashboard
![Workout Dashboard](./assets/workout-dashboard.png)
Track your exercises and view muscle group distribution in real-time.

### Profile Settings
![Profile Settings](./assets/profile-settings.png)
Easily update your profile information and manage account settings.

### Password Recovery
![Password Reset](./assets/password-reset.png)
Secure password reset process with email verification.

## Local Usage

1. Clone the repo;
2. Create and populate `.env` file;
3. Run this script on your postgres database after creation of respective Login/Group Role with it's password:
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

# Fix auto-increment for user IDs (Important for deployment)
ALTER TABLE wm_users DROP COLUMN _id;
ALTER TABLE wm_users ADD COLUMN _id SERIAL PRIMARY KEY;
```

4. In backend directory after updating your .env file:
```bash
cd backend
npm install 
npm run dev
```

5. In frontend directory:
```bash
npm install
npm start
```

## Environment Variables
### Backend .env

#--- Mandatory variables ---#
PG_USER=
PG_PASSWORD=
PG_HOST=
PG_DB=
MONGO_URI=
SECRET=
SALT=
EMAIL_HOST=
EMAIL_USERNAME=
EMAIL_PASSWORD=

#--- Optional with defaults ---#
PORT=
CLIENT_URL=
ORIGIN=
AUTH_TOKEN_EXPIRES_IN_MS=

### Frontend .env
REACT_APP_API=
REACT_APP_WEB_SERVICE=localhost

## Note
This is a demo app with limited storage capacity. Older entries may be automatically removed.

---

## Table of Contents

1. [App Features and Limitations](#features)
2. [Local Usage](#localUsage)
3. [Tools and Dependencies](#tools)
4. [Environment variables](#environment-variables)

---
<br>

## App Features (User's perspective walkthrough)<a name = "features"></a>
<p> 
As a user, you can create an account on Workout Mate from the Signup page with a valid email address and a strong password. You will then be sent an email with a link to confirm your account. Clicking on the link, you will be redirected to the page that will inform you that your account has been confirmed successfully and you can go to the Login page and use your credentials to access your account. If you enter wrong credentials, you will be alerted so. 
<br><br>
 <div align="center">
  <img src="https://i.imgur.com/Gle08r5.gif" alt="signing up" height="350px" padding="25px" />
  <img src="https://i.imgur.com/JNLATCl.gif" alt="confirming account" padding="0 25px" />
 </div>
<br><br>
Once you log in successfully, you will be redirected to your Home page where you will see your generated default username and avatar in the Navbar section. These can be changed by clicking on the avatar or username and then clicking the "Settings" option. This will open the "Profile Settings" form (modal) where you can enter a different username and choose a custom profile image from your device that you can also crop to your taste within the form. All the changes that you made will be saved after clicking the "Upload" button. You can close the modal by clicking the "X" in the top right corner of the form.
<br><br>
 <div align="center">
  <img src="https://i.imgur.com/xr5qKUC.gif" alt="opening profile settings" height="350px" />
  <img src="https://i.imgur.com/0QjVdG5.gif" alt="updating profile" height="400px" />
 </div>
<br><br>
You can start adding workouts by clicking the "Buff It Up" button. The workout form will appear with "title", "muscle group", "reps" and "load" input fields that you'll have to fill with valid values. Clicking "Add Workout" with valid input will close the modal and make a card with your workout details appear on the page. The time of the entry will be added automatically on every card and you'll find that the workouts are sorted in the chronological order, newer first.
<br><br>
 <div align="center"><img src="https://i.imgur.com/anAkQZ4.gif" alt="adding workout" height="350px" />
 </div> 
<br><br>
Pagination feature at the bottom-left of the page will enable you to access your entire workout history by clicking on buttons with page numbers or chevrons, since the limit is set to 3 workouts per page. Also, you can use the Search bar in the top-left section of the page (right below the Navbar) to search your workout history by the workout title.
 
Every workout card contains a "delete workout" (trash can) and "edit workout" (pen) icons at the bottom right of the card. By clicking on the trash can, the workout will be deleted from the database. By clicking on the pen, the Edit workout form will pop up and it will be pre-filled with the current workout details. After editing the workout and clicking save, the workout will be updated with the new details. You can opt out of editing by clicking "X".
<br><br>
 <div align="center"><img src="https://i.imgur.com/mYBr9nB.gif" alt="editing and deleting workouts" height="350px" /></div> 
<br><br>
You can finish your session with Workout Mate by clicking Log Out in the dropdown menu of your avatar/username and you will be logged out and redirected to the Login page.
 
If you happen to forget your password, you will be able to recover it by first clicking on "Forgot the password?" found in the login form, which will open a "Reset password request" form that will ask you to enter your email address that you have an account with. Once you correctly enter your email address and click "Proceed", you will be alerted to check your inbox for an email with the password reset link. When you click on the password reset link, you will be redirected to the password reset page that will contain a single form asking you to type your new password in two input fields. The form will check the strength of the new password as well as whether the passwords are matching before you will be allowed to finish the password reset. Once you've successfully reset your password, you will be able to access your account with it.
 <br><br>
 <div align="center">
  <img src="https://i.imgur.com/I4yC1sM.gif" alt="opening and submitting forgot password form" height="350px"/>
  <img src="https://i.imgur.com/9hbR4TV.gif" alt="resetting password" height="350px" />
 </div>
<br><br>
In case you want to delete your Workout Mate account, you will have to log in, open "Profile Settings" from the dropdown menu and click on "delete account" at the bottom-right of the form. You will see a dialogue pop-up that will warn you about the consequences of deleting your account and will give you an option to change your mind or delete your account permanently. After you click on "Yes, delete my account permanently", all your data will be deleted from the database and you will be redirected to the Login page. <br>
You can download your data from Workout Mate database as a JSON file by clicking on "download data" in Settings.
 <br><br>
 
 ### Limitations
 
<p>
 All users and posts are subject to automated deletion, oldest first, when the limits set on their quantity in the database are exceeded.
 If too many requests are sent to the server within a set timeframe, the server will respond with an error and reject further requests for a while. 
</p>

<br>

## Local Usage <a name = "localUsage"></a>

1. Clone the repo;
2. Create and populate ```.env``` file;
3. Run this script on your postgres database after creation of respective Login/Group Role with it's password:
```
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
```
4. In backend directory after updating your .env file:

```
cd backend
npm install 
npm run dev
```
4. In frontend directory: (Verify with the creation of ./node_modules folder)

```
npm install
npm start
```
### Frontend test command for debugging pages. (In frontend dir.)
```npm run test``` 

### Backend build command. (In backend dir.)
```npm run build```
<br>

## Tools and Dependencies <a name = "tools"></a>

### Backend

- [NodeJS] - Server logic
- [Express] - Routing
- [MongoDB] - Database
- [PostgreSQL] - client for Node.js (created_at, email, password(hashed), username, profile_image, account_status, _id)
- [Mongoose] - MongoDB document modelling
- [Bcrypt] - hashing passwords
- [Dotenv] - secret-keeping
- [Cors] - enabling CORS requests
- [JWT] - Authentication
- [Validator] - request (input) validation
- [Handlebars] - Email templates
- [Ethereal-Email] - Mock SMTP service

#### Dev Dependencies

- [Jest]- Javascript testing framework
- [MongoDB-MemoryServer] - testing/mocking MongoDB memory server in NodeJS
- [@shelf/jest-mongodb] - A Jest preset for running MongoDB memory server

### Frontend

- [React](https://reactjs.org/) - User interface
- [React router](https://reactrouter.com/en/main) - Browser routing
- [Redux](https://redux.js.org/) - State management
- [React easy crop](https://www.npmjs.com/package/react-easy-crop) - Image cropping
- [Date-fns] - Date formatting
- [ChartJS] - Charting library
- [React ChartJS](https://react-chartjs-2.js.org/) - ChartJS library for React
- [SASS](https://sass-lang.com/) - Styling

<br>

## Environment variables <a name = "environment-variables"></a>
If you want to run the app in your local environment, you'll need to create a .env file in each of the second-level directories and provide values for the variables below.<br>
### Backend .env

#--- Mandatory variables ---#

PG_USER= <br>
PG_PASSWORD= <br>
PG_HOST= <br>
PG_DB= <br>
MONGO_URI= <br>
SECRET= <br>
SALT= <br>
#--- Get fake email account here: https://ethereal.email/create <br>
EMAIL_HOST= <br>
EMAIL_USERNAME= <br>
EMAIL_PASSWORD= <br>

#--- Below are optional ones, defaults are provided ---#

PORT= <br>
CLIENT_URL= <br>
ORIGIN= <br>
AUTH_TOKEN_EXPIRES_IN_MS=  # in milliseconds<br>

#--- Database limits: <br>
MAX_USERS= <br>
MAX_WORKOUTS_PER_USER= <br>

#--- Rate limiter: <br>
MAX_API_WORKOUTS_REQS= <br>
MAX_API_USERS_REQS= <br>
MAX_API_RESET_PASSWORD_REQS= <br>

#--- Rate limiter windows (in milliseconds): <br>
API_WORKOUTS_WINDOW_MS= <br>
API_USERS_WINDOW_MS= <br>
API_RESET_PASSWORD_WINDOW_MS= <br>

#--- RETRY CONNECTING TO DB: <br>
MAX_RETRIES= <br>
RETRY_DELAY_MS= <br>

### Frontend .env
#--- Defaults provided ---#
REACT_APP_API= <br>
REACT_APP_WEB_SERVICE=localhost <br>

<br>









 
