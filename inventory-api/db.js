const Mongoose = require("mongoose")
const localDB = `mongodb+srv://thumarraj999:G7CS5A5HhCT43wvl@cluster0.qjym0ml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const connectDB = async () => {
  await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected")
}
module.exports = connectDB