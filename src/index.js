const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connectDataBase, DB_URI } = require('./db');
const { authMiddleWare } = require('./authMiddleWare')

const app = express();
connectDataBase();

app.set('pages', path.join(__dirname, 'pages'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src')));

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
app.use(session({
    secret: 'foo',
    resave: false,
    saveUninitialized: true,
    store: new MongoDBStore({
        uri: DB_URI,
        collection: "sessions",
    }),
    cookie: {
        secure: false
    }
}));

app.listen(3000, () => {
    console.log("CONNECTED");
});


app.get('/', authMiddleWare, (req, res) => {
    res.render("signUp.html");
});

app.get('/Login', (request, response) => {
    if (request.session && request.session.username) {
        response.redirect('/');
    } else {
        const { error } = request.query;
        response.render("login", { error });
    }
});

app.get('/SignUp', (req, res) => {
    res.render("signUp.html");
});

app.get('/TemporaryPassword', (request, response) => {
    response.render("temporaryPassword.html");
});

app.get('/RecoverPassword', (request, response) => {
    const { error, email } = request.query;
    response.render("recoverPassword", { error, email });
});

app.get('/TwoStepVerification', (request, response) => {
    const { error, msg } = request.query;
    response.render("twoStepVerification", { error, msg });
});

app.get('/ResendCode', async (request,response) => {
    const { sendOTP } = require('./services/EmailService');
    const { searchUser } = require('./services/UserService');
    try {
        const user = await searchUser(request.session.email);
        await sendOTP(user.email, user.name, request.session.otp);
        response.redirect('/ResendCode?msg=' + encodeURIComponent("Verification Code sent"))
    } catch (error) {
        response.redirect('/ResendCode?error=' + encodeURIComponent(error));
    }
})

app.post('/SignUp', async function (request, response) {
    const { register } = require('./services/UserService');
    const { sendTemporaryPassword } = require('./services/EmailService');
    const { name, username, lastName, email } = request.body;
    const { generateTemporaryPassword } = require('./services/UserService');
    const temporaryPassword = generateTemporaryPassword();
    const result = await register(name, username, lastName, email, temporaryPassword);
    console.log(result);
    if (result) {
        sendTemporaryPassword(email, name, temporaryPassword);
        response.redirect('/TemporaryPassword');
    } else {
        const errorMessage = 'There was an issue with registration. Please try again later.';
        response.redirect('/SignUp?error=' + encodeURIComponent(errorMessage));
    }
});


app.post('/Login', async function (request, response) {
    const { validateUser, generateOTP } = require('./services/UserService');
    const { sendOTP } = require('./services/EmailService');
    try {
        const { email, password } = request.body;
        const user = await validateUser(email, password);
        const otp = generateOTP();
        request.session.otp = otp;
        request.session.email = user.email;
        await sendOTP(user.email,user.name, otp);
        response.redirect('/TwoStepVerification');
    } catch (error) {
        response.redirect('/Login?error=' + encodeURIComponent(error));
    }
});

app.post('/ChangePassword', authMiddleWare, async function (request, response) {
    const username = request.session.username;
    const { changePassword } = require('./services/UserService');
    const { newPassword, confirmPassword } = request.body;
    const redirection = await changePassword(username, newPassword, confirmPassword);
    response.redirect(redirection);
});

app.get('/EditProfile', authMiddleWare, async (request, response) => {
    const { searchUserByUsername } = require('./services/UserService');
    const user = await searchUserByUsername(request.session.username);
    const { error } = request.query;
    response.render("EditProfile", { user, error });
});

app.get('/ChangePassword', authMiddleWare, (request, response) => {
    const { error } = request.query;
    response.render("changePassword", { error });
});

app.post('/ForgotPassword', async function (request, response) {
    const { forgotPassword } = require('./services/UserService');
    const email = request.body.email;
    const recoveredPassword = await forgotPassword(email);
    if (recoveredPassword) {
        response.redirect('/TemporaryPassword')
    } else {
        response.redirect('/ForgotPassword?error=%20unable%20to%20recover%20password');
    }
});


app.post('/EditProfile', authMiddleWare, async function (request, response) {
    const { updateUser } = require('./services/UpdateUserService');
    const username = request.session.username;
    const { email, name, lastName, profilePhoto } = request.body;
    const result = await updateUser(username, email, name, lastName, profilePhoto);
    response.send(result);
});


app.post('/TwoStepVerification', async function (request, response) {
    const { searchUser } = require('./services/UserService');
    const code = request.body.code;
    if (code === request.session.otp) {
        const user = await searchUser(request.session.email);
        if (user) {
            delete request.session.otp;
            delete request.session.email;
            request.session.username = user.username;
            response.redirect('/')
        } else {
            response.redirect('/TwoStepVerification?error=Email%20incorrect');
        }
    } else {
        response.redirect('/TwoStepVerification?error=Code%20incorrect');
    }
});

app.get('/ProfilePhoto', authMiddleWare, async (request, response) => {
    try {
        const { searchUserByUsername } = require('./services/UserService');
        const user = await searchUserByUsername(request.session.username);
        const image = path.join(__dirname, 'pages', user.profilePhoto);
        response.sendFile(image);
    } catch (error) {
        console.log(error);
        const image = path.join(__dirname, 'assets/default-profile-photo.png');
        response.sendFile(image);
    }
});

app.get('/LogOut', (request, response) => {
    request.session.destroy((error) => {
        if (error) {
            return response.status(500).send('There was an issue logging out')
        }
        response.clearCookie('connect.sid');
        response.redirect('/');
    });
});