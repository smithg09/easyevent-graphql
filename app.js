const express = require('express')
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const path = require('path')
const mongoose = require('mongoose');
const app = express();
const isAuth = require('./middleware/is-auth');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
// const events = [];

app.use(bodyParser.json()); 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


// Serve static assets if in production
if (true) {
  // static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}


app.use(isAuth);
app.use(
  "/api",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);

const port = process.env.PORT || 3000;
mongoose.connect(`mongodb+srv://awstest:awstest@cluster0-p0icc.mongodb.net/graphql_app?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server Started at ${port}`)
        })
    }).catch(err => {
        console.log(err);
})
