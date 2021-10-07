const express = require('express');
const app = express();
const port = process.env.PORT;
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

// app.use((req,res,next) => {
//   if(req.method !== 'GET') {
//     res.status(403).json({
//       statusCode: 403,
//       header: 'Unauthorized',
//       error: 'ONLY GET REQUESTS ARE ENABLED',
//     })
//   } else {
//     next()
//   }
// })

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log('Server is up on port http://localhost:' + port);
});