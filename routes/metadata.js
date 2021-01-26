const express = require('express');
const router = express.Router();
const Metadata = require("../models/metadata");
const Sessions = require("../models/sessions");
const auth = require("../middleware/auth");
const csv = require('csvtojson');
const moment = require('moment');

router.get("/", auth.loginAuth, async (req, res) => {
    try{
        let metadata = await Metadata.find({});
        console.log(metadata[0]);
        res.json({
            success: true,
            data: metadata
        });
    }catch(err){
        console.log(err);
        res.status(500).json({ success: false, error: "Internal Server Error!" });
    }
});

router.get("/:id", auth.loginAuth, async (req, res) => {
    try{
        let data = await Sessions.find({metadataId: req.params.id});
        if(data.length > 0){
            res.json({
                success: true,
                data: data
            });
        }else{
            let metadata = await Metadata.findById(req.params.id);
            let jsonArray;
            if(metadata.etf == "N")
                jsonArray = await csv().fromFile("./data/stocks/"+metadata.symbol+".csv");
            else
                jsonArray = await csv().fromFile("./data/etfs/"+metadata.symbol+".csv");
            let count = 0;
            let sessions = [];
            console.log(jsonArray);
            jsonArray.forEach(async value => {
                let session = new Sessions({
                    metadataId: metadata._id,
                    date: moment(value["Date"], 'YYYY-MM-DD').toDate(),
                    open: value["Open"],
                    high: value["High"],
                    close: value["Close"],
                    low: value["Low"],
                    adjClose: value["Adj Close"],
                    volume: value["Volume"]
                });
                const saveSession = await session.save();
                sessions.push(saveSession);
                count++;
                if(count == jsonArray.length){
                    res.json({
                        success: true,
                        data: sessions
                    });
                }
            });
        }
    }catch(err){
        console.log(err);
        res.status(500).json({ success: false, error: "Internal Server Error!" });
    }
});

module.exports = router;
