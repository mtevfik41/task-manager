const mongoose = require("mongoose");
const validator = require("validator")

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api",{
  useNewUrlParser: true
})

const User = mongoose.model('User', {
  name: {
    type: String,
    default: 'Anonymous',
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid")
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error("Password cannot contain 'password'")
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number')
      }
    },
  }
})

// const me = new User({
//   name: 'Mustafa',
//   email: 'mtevfik41@gmail.com',
//   age: 21,
//   password: 'phone0432!'
// })
//
// me.save().then(() => {
//   console.log(me)
// }).catch(error => {
//   console.log("Error!",error)
// })

const Task = mongoose.model('Task', {
  description: {
    type: String,
    trim: true,
    require: true,
  },
  completed: {
    type: Boolean,
    default: false
  }
})

// const task = new Task({
//   description: 'Test',
//   completed: true
// })
//
// task.save().then(() => {
//   console.log(task)
// }).catch(error => {
//   console.log(error)
// })