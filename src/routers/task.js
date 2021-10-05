const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');
const User = require('../models/user');

// Create new task POST /tasks
router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();

    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }

});

// Get All Tasks GET /tasks
router.get('/tasks', auth, async (req, res) => {
  try {
    await req.user.populate('tasks');
    res.status(200).send(req.user.tasks);
  } catch (e) {
    res.status(400).send();
  }
});

// Get a specific task with ID GET /tasks/:id
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({_id, owner: req.user._id});
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }/**/
});

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every(
      (update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    if (updates.length === 1) {
      return res.status(400).send({error: 'Invalid update!'});
    }
    return res.status(400).send({error: 'Invalid updates!'});
  }

  try {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach(update => task[update] = req.body[update]);

    await task.save();
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete a task DELETE /tasks/:id
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete(
        {_id: req.params.id, owner: req.user._id});

    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;