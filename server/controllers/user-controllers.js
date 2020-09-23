const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'ssdsd',
    email: 'world@gmail.com',
    password: 'sdfsc5416',
  },
  {
    id: 'u2',
    name: 'ssdsd',
    email: 'wefdorld@gmail.com',
    password: 'sfgsc5416',
  },
  {
    id: 'u3',
 
  },
];

const getUsers = async (req, res, next) => {
 
  let users
  try {
    users = await User.find({}, '-password');
  }  catch (err) { 
    const error = new HttpError(
      'Fetching users failed, please try again',
      500
    );
    return next(error);
  }
  
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};


const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { 
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  };

  const {name, email, password, places} = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) { 
    const error = new HttpError(
      'Signin up faild, please try again',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, plaese login instead',
      422
    );
    return next(error);
  }

  const createUser = new User ({
    name,
    email,
    password, 
    image: "https://a7.org/pictures/964/964493.jpg",
    places
  });

  try {
    await createUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createUser.toObject({ getters: true }) })
};


const login = async (req, res, next) => {
  const { email, password} = req.body;

  let existingEmail;
  try {
    existingEmail = await User.findOne({ email: email })
  } catch (err) { 
    const error = new HttpError(
      'Loggin in faild, please try again',
      500
    );
    return next(error);
  }

  if (!existingEmail || existingEmail.password !== password) {
    const error = new HttpError(
      'Invalid credentials, Could login you in.',
      401
    );
    return next(error);
  }

  res.send('!נכנסת בהצלחה')
}


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;