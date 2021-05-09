var JSONStream = require("JSONStream");
var es = require("event-stream");
var fs=require("fs");
var bmiDetails={};

var mapOfRanges=new Map(); //map of risks and ranges
mapOfRanges.set("Malnutrition",{low:0,high:18.4,category:"Under-weight"});
mapOfRanges.set("Low",{low:18.5,high:24.9,category:"Normal weight"});
mapOfRanges.set("Enhanced",{low:25,high:29.9,category:"Over-weight"});
mapOfRanges.set("Medium",{low:30,high:34.9,category:"Moderately-obese"});
mapOfRanges.set("High",{low:35,high:39.9,category:"Severly-weight"});
mapOfRanges.set("Very high",{low:40,high:100,category:"Very severely-obese"});


function processPatient(data){

    bmiDetails={
        gender:data.Gender,
        heightCm:data.HeightCm,
        weightKg:data.WeightKg,
        bmi: 0,
        category:"",
        risk:""
    };

    //if heightCM > 0  
    if(data.HeightCm>0){
        //round off to 2 decimal places
        bmiDetails.bmi=( data.WeightKg*10000/(data.HeightCm*data.HeightCm) ).toFixed(2);

        for (let [key, value] of mapOfRanges) {
          if( value.low<=bmiDetails.bmi && value.high>=bmiDetails.bmi ){
            bmiDetails.category=value.category;
            bmiDetails.risk=key;

            break;
          }
        }

    }

    return bmiDetails;
    
}



const filePath="./input.json";
/* We are assuming that the input file has 1 lac records
   So instead of loading it into memory we will stream the data one by one
*/
fileStream =fs.createReadStream(filePath, { encoding: "utf8" });
fileStream.pipe(JSONStream.parse("patients.*")).
    pipe(es.mapSync(function (data) {
        
        bmiDetails=processPatient(data);
        console.log(bmiDetails);
        
        return data
    }));
