const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

app.use(express.json());

// Create new user POST /users
app.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }

});
// Get All Users GET /users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send();
  }
});

// Get User with Specific ID GET /users/:id
app.get('/users/:id', async (req, res) => {
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
app.patch("/users/:id", async (req,res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name','email','password','age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    if (updates.length === 1) {
      return res.status(400).send({error:'Invalid update!'})
    }
    return res.status(400).send({error: 'Invalid updates!'})
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

    if(!user) {
      return res.status(404).send()
    }
    res.status(200).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Create new task POST /tasks
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();

    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }

});

// Get All Tasks GET /tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (e) {
    res.status(400).send();
  }
});

// Get a specific task with ID GET /tasks/:id
app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }/**/
});

app.patch("/tasks/:id", async (req,res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ["description","completed"]
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    if (updates.length === 1) {
      return res.status(400).send({error:'Invalid update!'})
    }
    return res.status(400).send({error: 'Invalid updates!'})
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!task) {
      return res.status(404).send()
    }

    res.status(200).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.listen(port, () => {
  console.log('Server is up on port http://localhost:' + port);
});