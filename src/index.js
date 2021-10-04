const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('./db/mongoose');

const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

app.use(express.json());

const router = new express.Router()

app.use(userRouter)
app.use(taskRouter)




app.listen(port, () => {
  console.log('Server is up on port http://localhost:' + port);
});