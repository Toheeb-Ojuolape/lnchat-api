const express= require('express')
// const { Request, Response }  = require('express')
const cors = require('cors')
const expressWs = require('express-ws')
const routes = require('./routes/routes')


const PORT = 5000;

//
// Create Express server
//
const { app } = expressWs(express());
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

/**
 * ExpressJS will hang if an async route handler doesn't catch errors and return a response.
 * To avoid wrapping every handler in try/catch, just call this func on the handler. It will
 * catch any async errors and return
 */


//
// Configure Routes
//
// app.get('/api/posts', catchAsyncErrors(routes.getPosts));
// app.post('/api/posts', catchAsyncErrors(routes.createPost));
// app.post('/api/posts/:id/upvote', catchAsyncErrors(routes.upvotePost));

//
// Configure Websocket
//

 

//
// Start Server
//
console.log('Starting API server...');
app.listen(PORT, async () => {
  console.log(`API listening at http://localhost:${PORT}`);

  // Rehydrate data from the DB file
});



app.use(routes)