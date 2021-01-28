const express = require('express');
const router = express.Router();
const Securities = require("../models/securities");
const Sessions = require("../models/sessions");
const auth = require("../middleware/auth");
const csv = require('csvtojson');
const moment = require('moment');

router.get("/", auth.loginAuth, async (req, res) => {
    try{
        let securities = await Securities.find({});
        res.json({
            success: true,
            securities: securities
        });
    }catch(err){
        console.log(err);
        res.status(500).json({ success: false, error: "Internal Server Error!" });
    }
});

router.get("/:id", auth.loginAuth, async (req, res) => {
    try{
        let sessions, security;
        if(req.query.startDate && req.query.endDate){
            sessions = await Sessions.find({metadataId: req.params.id,
                                                date: {
                                                    $gte: new Date(req.query.startDate),
                                                    $lte: new Date(req.query.endDate)
                                                }}).sort( { "date": -1 } );
            security = await Securities.findById(req.params.id);

            res.json({
                success: true,
                sessions: sessions,
                security: security
            });
        }else if(req.query.startDate){
            sessions = await Sessions.find({metadataId: req.params.id,
                                                date: {
                                                    $gte: new Date(req.query.startDate)
                                                }}).sort( { "date": -1 } );
            security = await Securities.findById(req.params.id);
            res.json({
                success: true,
                sessions: sessions,
                security: security
            });
        }else if(req.query.endDate){
            sessions = await Sessions.find({metadataId: req.params.id,
                                                date: {
                                                    $lte: new Date(req.query.endDate)
                                                }}).sort( { "date": -1 } );
            security = await Securities.findById(req.params.id);
            res.json({
                success: true,
                sessions: sessions,
                security: security
            });
        }else{
            sessions = await Sessions.find({metadataId: req.params.id}).sort( { "date": -1 } ).limit(1825);
            security = await Securities.findById(req.params.id);
            if(sessions.length > 0){
                res.json({
                    success: true,
                    sessions: sessions,
                    security: security
                });
            }else{
                security = await Securities.findById(req.params.id);
                let jsonArray;
                if(security.etf == "N")
                    jsonArray = await csv().fromFile("./data/stocks/"+security.symbol+".csv");
                else
                    jsonArray = await csv().fromFile("./data/etfs/"+security.symbol+".csv");
                let count = 0;
                jsonArray.forEach(async value => {
                    session = new Sessions({
                        metadataId: security._id,
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
                        let sessions = await Sessions.find({metadataId: req.params.id}).sort( { "date": -1 } ).limit(1825);
                        return res.json({
                            success: true,
                            sessions: sessions,
                            security: security
                        });
                    }
                });
            }
        }

    }catch(err){
        console.log(err);
        res.status(500).json({ success: false, error: "Internal Server Error!" });
    }
});

module.exports = router;
