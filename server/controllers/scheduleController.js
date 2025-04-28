const transectionModel = require("../models/transectionModel");
const Order = require("../models/Order");
const Attendence = require("../models/Attend");
const CronJob = require("node-cron");

exports.initScheduledJobsMinite = () => {
    const scheduledJobFunction = CronJob.schedule("* * * * *", async () => {
        console.log("I'm executed on a schedule!");
        try {
            await Promise.all([
                OrderToTransection(),
                AttendenceToTransection()
            ]);
        } catch (error) {
            console.error("Scheduled job failed:", error);
        }
    });

    scheduledJobFunction.start();
}

const AttendenceToTransection = async () => {
    console.log("start AttendenceToTransection");
    try {
        const endTime = new Date();
        
        const attendenceDetails = await Attendence.find({
            end_time: {
                $lte: endTime.getTime(),
            },
            isAvilabaleReport: false
        });

        console.log("attendenceDetails date", { endTime, attendenceDetails });
        
        if (attendenceDetails && Array.isArray(attendenceDetails) && attendenceDetails.length > 0) {
            console.log("inside attendenceDetails if");
            await Promise.all(attendenceDetails.map(async (val) => {
                try {
                    const transectionData = {
                        userid: val.user_id,
                        amount: val.total,
                        category: "Salary",
                        type: "expense",
                        refrence: val._id,
                        description: "Schedule Attendence insert at " + endTime.toISOString(),
                        date: (new Date(val.end_time)).toISOString(),
                        isAuto: 1
                    };

                    await (new transectionModel(transectionData)).save();
                    await Attendence.findOneAndUpdate(
                        { _id: val._id },
                        { isAvilabaleReport: true },
                        { new: true }
                    );
                    
                    console.log("insert attendenceDetails done ", val._id);
                } catch (error) {
                    console.error("Error processing attendance record:", error);
                }
            }));
        }
    } catch (error) {
        console.error("AttendenceToTransection failed:", error);
    }
    console.log("end AttendenceToTransection");
}

const OrderToTransection = async () => {
    console.log("start OrderToTransection");
    try {
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - (1 * 60000));
        
        const orderDetails = await Order.find({
            date: {
                $gte: startTime,
                $lte: endTime,
            }
        });

        console.log("date", { endTime, startTime, orderDetails });
        
        if (orderDetails && Array.isArray(orderDetails) && orderDetails.length > 0) {
            console.log("inside if");
            await Promise.all(orderDetails.map(async (val) => {
                try {
                    const transectionData = {
                        userid: val.user_id,
                        amount: val.total,
                        category: "Order",
                        type: "income",
                        refrence: val._id,
                        description: "Schedule order insert at " + endTime.toISOString(),
                        date: (new Date(val.date)).toISOString(),
                        isAuto: 1
                    };
                    
                    await (new transectionModel(transectionData)).save();
                    console.log("insert done ", val._id);
                } catch (error) {
                    console.error("Error processing order:", error);
                }
            }));
        }
    } catch (error) {
        console.error("OrderToTransection failed:", error);
    }
    console.log("end OrderToTransection");
}