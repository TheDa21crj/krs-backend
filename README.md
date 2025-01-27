# KR Backend &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Aditya-ranjan-16/krs-backend/blob/master/License)

This is a backend project built with Node.js and MongoDB. It uses several libraries, including:

- [Express](https://expressjs.com/) - a fast, minimalist web framework for Node.js
- [Express-validator](https://github.com/express-validator/express-validator) - a set of express.js middleware functions to validate request data
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) - a library to help hash passwords
- [Gravatar](https://github.com/emerleite/node-gravatar) - a library to generate Gravatar URLs
- [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - a library to generate JWT tokens
- [Mongoose](https://mongoosejs.com/) - a MongoDB object modeling tool
- [Nodemailer](https://github.com/nodemailer/nodemailer) - a module to send emails
- [Razorpay](https://razorpay.com/docs/) - a payment gateway
- [UUID](https://github.com/uuidjs/uuid) - a library to generate UUIDs

### Environment Variables

This project requires the following environment variables:

- `DB_URI`: the MongoDB connection string
- `JWT_SECRATE`: the secret used to sign JWT tokens
- `SHEET_BUG`: the email address used to send emails
- `RZPY_ID`: the Razorpay API key ID
- `RZPY_SECRET`: the Razorpay API key secret
- `SHEET_ID`: the_spreadsheet_id
- `SHEET_KEY`: the_spreadsheet_key

You can create a `.env` file in the root directory of the project to set these variables.

### Running the Project Locally

- Clone the repository:

```
git clone https://github.com/Aditya-ranjan-16/krs-backend.git
```

- Install dependencies:

```
cd krs-backend
npm install
```

- Start the server:

```
npm start
```

The server will listen on port 5000 by default.

### Routing Guide

This project has the following endpoints:

- GET `/test` - Test the server is running

### User

| Methods | Route                 | Description              | Request                                        | Response                                                           |
| ------- | --------------------- | ------------------------ | ---------------------------------------------- | ------------------------------------------------------------------ |
| POST    | `/api/user/sendEmail` | Send The Mail            | name, email, message                           | 'Send' if the mail was send successfully                           |
| GET     | `/api/user/add`       | Add User                 | name, email, image, roll, branch, year, number | message: "User Added", user {name, email, pic, roll, year, branch} |
| GET     | `/api/user/`          | Get the Events (of User) | email                                          | { users, userevents: events }                                      |

### Events

| Methods | Route                          | Description                             | Request                                                                                                           | Response                         |
| ------- | ------------------------------ | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| GET     | `/api/events/`                 | Get all the Events                      |                                                                                                                   | events                           |
| GET     | `/api/events/home`             | Get latest 3 the Events (for home page) |                                                                                                                   | events ( latest 3 only)          |
| GET     | `/api/events/list`             | Get event list                          |                                                                                                                   | list                             |
| GET     | `/api/events/checkform/:eid`   | Find event by ID                        | eventId (**params**)                                                                                              | exist: true                      |
| GET     | `/api/events/id/:eid`          | Get event by ID                         | eventId (**params**)                                                                                              | events                           |
| POST    | `/api/events/addEvent`         | Add event                               | title, subtitle, description, venue, mode, teamsize, teamcreation, date, img1, img2, img3, status, sheetid, price | success: true, data: saveit.\_id |
| PATCH   | `/api/events/editEvent/:eid`   | Edit event                              | eventId (**params**)                                                                                              | success: true                    |
| DELETE  | `/api/events/deleteEvent/:eid` | Delete event                            | eventId (**params**)                                                                                              |

### Members

| Methods | Route                           | Description            | Request                                                                                       | Response                                        |
| ------- | ------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| GET     | `/api/members/`                 | Get all Members        |                                                                                               | retrieve all documents from a member collection |
| GET     | `/api/members/one`              | Get 1 Member           | email                                                                                         | retrieve 1 documents from a member collection   |
| POST    | `/api/members/addMember`        | Add Member             | name, designation, image, domain, year, bio, linkedin, github, insta, branch, email, password | message: "Member added"                         |
| PATCH   | `/api/members/changePassword`   | Change member password | email, password, newPassword                                                                  |
| PATCH   | `/api/members/updateMember/:id` | Upadate Member Details | name, designation, image, domain, year, bio, branch, email, linkedin, github, insta           | findMember: Upadate Details                     |
| DELETE  | `/api/members/removeMember/:id` | Delete Member          | email(**params**)                                                                             | message: deleteMember                           |
| POST    | `/api/members/MemUpdate/`       | Update Social Details  | linkedin, github, insta, bio                                                                  |

### Forms

| Methods | Route                        | Description    | Request                                | Response               |
| ------- | ---------------------------- | -------------- | -------------------------------------- | ---------------------- |
| GET     | `/api/form/getForms/`        | Get all Form   |                                        | form                   |
| GET     | `/api/form/getForms/:id`     | Get Form by ID | form id                                | form, event: eventinfo |
| POST    | `/api/form/deleteForms/:fid` | Delete Form    | form id                                |
| PATCH   | `/api/form//editForms/:fid`  | Edit Form      | form id,subtitle, instruction, heading |

#### Login

| Methods | Route                                         | Description        | Request                                                        | Response                                                        |
| ------- | --------------------------------------------- | ------------------ | -------------------------------------------------------------- | --------------------------------------------------------------- |
| POST    | `/api/login/login/`                           | Login              | email, password                                                | success, token, user                                            |
| POST    | `/api/login/glogin/`                          | Google Login       | email                                                          | success, token, user                                            |
| POST    | `/api/login/signup/`                          | Sign Up            | email, name, designation, year, branch, password, number, roll | exists, token, user                                             |
| POST    | `/api/login/forgotPassword/otpValidate/`      | Verify OTP         | email, otp                                                     | message: "Valid OTP"                                            |
| POST    | `/api/login/forgotPassword/sendEmail/:email/` | Send Email for OTP | email                                                          | message: "Email found and otp send"                             |
| POST    | `/api/login/resetPassword/`                   | Reset Password     | password, cpassword, email                                     | message: `Password = ${password} and cpassword = ${cpassword}`, |
| POST    | `/api/login/getlevel/`                        | Get User Level     |                                                                | level                                                           |

#### Registration

| Methods | Route                                     | Description                            | Request             | Response                                    |
| ------- | ----------------------------------------- | -------------------------------------- | ------------------- | ------------------------------------------- |
| POST    | `/api/registration/register/checkreg/`    | Register the user for the event        | email, formid,      | reg, code                                   |
| POST    | `/api/registration/register/createOrder/` | for processing payments using razorpay | price               | orderId                                     |
| POST    | `/api/registration/register/counter/`     | Total Registration Number              | formid              | count: result.length                        |
| POST    | `/api/registration/register/createteam/`  | Create Team (if required)              | email, formid,      | success or message: "Team Exsists"          |
| POST    | `/api/registration/register/jointeam/`    | Join Team (if required)                | email, code, formid | success, msg                                |
| POST    | `/api/registration/register/leaveteam/`   | Leave Team (if required)               | email, code, formid | success                                     |
| POST    | `/api/registration/register/verify/`      | Verification of the team               | formid, type,       | success, info                               |
| POST    | `/api/registration/register/teamstatus/`  | Get team Status                        | email, formid       | exist: true,teaminfo, verification, domain, |

#### Auth

This is a middleware function in a Node.js application that is responsible for authenticating requests using JSON Web Tokens (JWTs). Here's what it does:

1. It requires the jsonwebtoken library and a custom HttpError model.
1. It exports a function that takes three parameters: req, res, and next. This function will be called for every incoming request.
1. It first checks whether the request method is OPTIONS. If it is, it calls the next function and moves on to the next middleware function.
1. If the request method is not OPTIONS, it checks whether the request header contains an Authorization token. If it doesn't, it creates a new HttpError object with a status code of 401 (unauthorized) and passes it to the next function.
1. If the request header does contain an Authorization token, it verifies the token using the jsonwebtoken library and the secret key stored in the JWT_SECRATE environment variable. If the verification fails, it creates a new HttpError object with a status code of 403 (forbidden) and passes it to the next function.
1. If the verification succeeds, it adds the decoded user data to the res.locals object, which can be accessed by other middleware functions later in the request lifecycle. It then calls the next function to pass control to the next middleware function.

In summary, this middleware function checks whether the incoming request has a valid JWT in the Authorization header, and if it does, it decodes the token and adds the user data to the res.locals object. If the request is not authorized, it returns an appropriate HttpError object.

#### Mailer

This is a Node.js function that uses the nodemailer library to send an email containing an OTP (One Time Password) to a specified email address. Here's what it does:

1. The function takes three parameters: email (the email address to send the OTP to), otp (the OTP to be sent), and res (the response object to send back to the client).
1. It creates a transporter object using the nodemailer.createTransport() method. This object contains the configuration options for the email service to be used. In this case, it is set up to use the Gmail SMTP server and authentication is required using the user and pass properties.
1. It creates a mailOptions object that contains the details of the email to be sent. It includes the from and to email addresses, the subject, and the body of the email. The OTP is included in the body of the email using HTML formatting.
1. It calls the transporter.sendMail() method to send the email. This method takes two parameters: the mailOptions object and a callback function that is called when the email is sent (or fails to send).
1. If the email is sent successfully, the callback function logs a message to the console and sends a 200 status code in the response object back to the client.
1. If there is an error sending the email, the callback function logs the error to the console and sends a 304 status code in the response object back to the client.

In summary, this function uses the nodemailer library to send an email containing an OTP to a specified email address. If the email is sent successfully, it sends a 200 status code in the response object back to the client. If there is an error sending the email, it sends a 304 status code in the response object back to the client.

### License

krs-backend is [MIT licensed](https://github.com/Aditya-ranjan-16/krs-backend/blob/master/License).
