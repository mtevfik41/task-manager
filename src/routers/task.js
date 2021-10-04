const express = require("express")
const router = new express.Router()
const Task = require('../models/task');
// Create new task POST /tasks
router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();

    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }

});

// Get All Tasks GET /tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (e) {
    res.status(400).send();
  }
});

// Get a specific task with ID GET /tasks/:id
router.get('/tasks/:id', async (req, res) => {
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

router.patch("/tasks/:id", async (req,res) => {
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

// Delete a task DELETE /tasks/:id
router.delete("/tasks/:id", async (req,res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      return res.status(404).send()
    }

    res.status(200).send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router