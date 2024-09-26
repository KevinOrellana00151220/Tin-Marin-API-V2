const Mongoose = require("mongoose");

const dbhost = process.env.DBHOST || "localhost";
const dbport = process.env.DBPORT || "27017";
const dbname = process.env.DBNAME || "TinMarinApp";

const uri = process.env.DBURI || `mongodb+srv://admin:Fp6pvSfe42xXVDpv@cluster0.xx8sk.mongodb.net/`;

const connect = async () => {
    try {
        await Mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log("DB connection successful");
    } catch (error){
        console.log("Error in DB connection");
        process.exit(1);
    }
};

module.exports = {
    connect
}