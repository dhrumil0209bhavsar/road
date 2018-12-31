const CONSTANTS = require('../../globals').constants;
const express = require('express');
const router = express.Router();
const fetch = require("node-fetch")
const db = require('../../db');


let getOfficerObjectByRoadCode = async (road_code) => {
    //find roadToOfficer entry for given road_code
    let findOfficerToRoadCodeEntryQuery = db.RoadToOfficer.findOne({ road_code: road_code });
    let findOfficerToRoadCodeEntryResult = await findOfficerToRoadCodeEntryQuery.exec();
    if(findOfficerToRoadCodeEntryResult != null)
        return findOfficerToRoadCodeEntryResult.officer;
    return -1;
}

function test(lat,lon,response){
    fetch("https://ncog.gov.in/RNB_mob_data/get_road?code=4862&lat="+lat+"&lon="+lon)
    .then(res => res.json())
    .then(async res => {
        console.log(res);
        
        let roadCode,minD = 1.5,category,roadName;
        for(x of res){
            if(x["distance"] < minD){
                roadCode = x["uniqe_code"];
                roadName = x["road_name"];
                category = x["category_s_p"];
                minD = x["distance"];
            }
        }

        if(minD != 1.5){
            console.log("Road Found");
            let officerObjectId = await getOfficerObjectByRoadCode(roadCode);
            console.log("Officer ID : " + officerObjectId);
 
            if(officerObjectId == -1) {
                console.log("Officer Not Found"); 
                let url = 'https://script.google.com/macros/s/AKfycbwIM32oMgHoLuJQDKRnBJNDBSlHtfrb70kOpp6_saGRD7kfqhU/exec?';
                url+= "lon_lat=" + lat + "_" + lon + "&roadFound=" + "true"
                    "&officerID=" + "officerNotFound" + "&uniqeCode=" + roadCode  
                    +   "&roadName=" + roadName + "&distance=" + minD +
                    "&category=" + category;

                fetch(url).then(res => res.json()).then(res => console.log(res["row"]));

                response.json({ success: false, data: "No Officer found on given road" }); return; 

            }else{
                let url = 'https://script.google.com/macros/s/AKfycbwIM32oMgHoLuJQDKRnBJNDBSlHtfrb70kOpp6_saGRD7kfqhU/exec?';
                url+= "lon_lat=" + lat + "_" + lon + "&roadFound=" + "true"
                    "&officerID=" + officerObjectId +   "&uniqeCode=" + roadCode  
                    +   "&roadName=" + roadName + "&distance=" + minD+
                    "&category=" + category;

                fetch(url).then(res => res.json()).then(res => console.log("Inserted in excel @row : ",res["row"]));

                response.json({ success: true, roadName : roadName, distance : distance }); return; 
            }

        }else{
            console.log("Too far away from Road");
            response.json({ success: false, roadName : "Too far"}); return; 
        }

    });

}

router.get('/roadTest', (req, res) => {

    if (req.query.lon_lat) {
        let arr = req.query.lon_lat.split(",");
        test(arr[0].trim(),arr[1].trim(),res);
    }
    else{
        res.json({ success: false, roadName : "No lat_lon"}); return; 
    }
});

router.get('/testArray', (req, res) => {

    if (req.query.lon_lat) {
        let arrAll = req.query.lon_lat.split(","); 

        arrAll.forEach(e => { 
            let arr = e.split(",");
            test(arr[0].trim(),arr[1].trim(),res); 
        });
    }
    else{
        res.json({ success: false, roadName : "No lat_lon"}); return; 
    }
});


module.exports = router;