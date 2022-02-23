const mongoose = require("mongoose")
const uri = 'mongodb+srv://admin:IkBq06FLwAqmpYra@cluster0.yjb5s.gcp.mongodb.net/1001-webapi-nuxtjs?retryWrites=true&w=majority'
mongoose.connect(uri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true
}).catch(error =>  console.error(error));