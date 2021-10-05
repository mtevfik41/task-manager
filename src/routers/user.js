const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

// Create new user POST /users
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({user, token});
  } catch (e) {
    res.status(400).send(e);
  }

});
// User Login Page
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({user, token});
  } catch (e) {
    res.status(400).send();
  }
});

// Logout
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});
// Logout
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});
// Show your profile
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

// Get All Users GET /users
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).send(users);
  } catch (e) {
    res.status(500).send();
  }
});

// Get User with Specific ID GET /users/:id
router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send();
  }

});

// Update an user with a specific ID PATCH /users/:id
router.patch('/users/me',auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(
      (update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    if (updates.length === 1) {
      return res.status(400).send({error: 'Invalid update!'});
    }
    return res.status(400).send({error: 'Invalid updates!'});
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);

    await req.user.save();

    // const req.user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

    if (!req.user) {
      return res.status(404).send();
    }
    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete a user DELETE /users/me
router.delete('/users/me', auth,async (req, res) => {
  try {
    await req.user.remove()

    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;