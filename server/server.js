var express = require("express");
var dotenv = require("dotenv");
var bodyParser = require("body-parser");
var cors = require('cors');
var multer = require("multer");
var mongoose = require("mongoose");
const Supplier = require("./models/Supplier");
var Device = require("./models/Device");
var User = require("./models/User");
var tokenRoute = require("./routes/token_route");
const supplierRoute = require("./routes/supplier_route");
var userRoute = require("./routes/user_route");
var productRoute = require("./routes/product_route");
var cartRoute = require("./routes/cart_route");
var checkoutRoute = require("./routes/checkout_route");
var orderRoute = require("./routes/order_route");
var appoinmentRoute = require("./routes/appointment_route");
var empRoute = require("./routes/emp_route");
const serviceRouter = require("./routes/service.js");
const offerRouter = require("./routes/offer.js");
const transectionsRouter = require("./routes/transections_route.js");
const postRoutes = require('./routes/posts_route.js');
const scheduledFunctions = require("./controllers/scheduleController")
const leaveRoute = require('./routes/leave_route.js');

var app = express();
dotenv.config({ path: "./config.env" });
var form = multer({ dest: 'uploads/' });
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use(form.any());


var DB_URI = process.env.ATLAS_URI;
var option = { 
    dbName: "sms",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    retryWrites: true
};

// Create a connection handler
const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI, option);
        console.log("Database connected!!!");
        // Only initialize scheduled jobs after successful DB connection
        scheduledFunctions.initScheduledJobsMinite();
    } catch (error) {
        console.log("Db connect failed - " + error);
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

// Initial connection
connectDB();

//authentication
app.use((req, res, next) => {

    const token = req.body.token;

    
    if (token != null) {

        const date = new Date();
        const time = date.getTime();
        const token = req.body.token;

        
        Device.findOne({ token: token }).then((doc) => {

            if (doc == null) {
                res.send({ "status": "invalid_token", "message": "This token is invalid." });
                return;
            }

            const userId = doc.user_id;
            const expire = doc.expire;
            
            if (time > expire) {
                res.send({ "status": "token_expired", "message": "This token is expired." });
                return;
            }

            //get user details
            User.findOne({ _id: userId }).then((doc) => {
                req.current_user = { "user_id": userId, "user": doc };
                next();
                return;
            }).catch((e) => {
                res.send({ status: "failed", "message": "Please try again 1." });
                return;
            });

        }).catch((e) => {
            res.send("error - " + e);
            return;
        });

    } else {
        req.current_user = null;
        next();
    }

});

app.use("/token", tokenRoute);
app.use("/supplier", supplierRoute); 
app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);
app.use("/checkout", checkoutRoute);
app.use("/order", orderRoute);
app.use("/appointment", appoinmentRoute);
app.use("/emp", empRoute);
app.use("/service",serviceRouter);
app.use("/offer",offerRouter);
app.use("/transections",transectionsRouter);
app.use(postRoutes);
app.use("/leave",leaveRoute);


app.get("/image/:imageName", (req, res) => {
    var imageName = req.params.imageName;
    res.sendFile(__dirname + "/uploads/" + imageName);
});


app.get("*",(req,res)=>{
    res.send("Hello world!!!");
});

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server is running on post: ${port}`);
});