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
        let sessions = await Sessions.find({metadataId: req.params.id}).sort( { "date": -1 } );
        let metadata = await Metadata.findById(req.params.id);
        if(metadata.length > 0){
            res.json({
                success: true,
                data: sessions,
                metadata: metadata
            });
        }else{
            let metadata = await Metadata.findById(req.params.id);
            let jsonArray;
            if(metadata.etf == "N")
                jsonArray = await csv().fromFile("./data/stocks/"+metadata.symbol+".csv");
            else
                jsonArray = await csv().fromFile("./data/etfs/"+metadata.symbol+".csv");
            let count = 0;
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
                count++;
                if(count == jsonArray.length){
                    let sessions = await Sessions.find({metadataId: req.params.id}).sort( { "date": -1 } );
                    res.json({
                        success: true,
                        data: sessions,
                        equity: metadata
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
