var JSONStream = require("JSONStream");
var es = require("event-stream");
var fs=require("fs");
var bmiDetails={};


const filePath="./input.json";
/* We are assuming that the input file has 1 lac records
   So instead of loading it into memory we will stream the data one by one
*/
fileStream = fs.createReadStream(filePath, { encoding: "utf8" });
fileStream.pipe(JSONStream.parse("patients.*")).
pipe(es.mapSync(function (data) {
    processPatient(data);
    return data
  }));


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
        //round of to 2 decimal places
        bmiDetails.bmi=( data.WeightKg*10000/(data.HeightCm*data.HeightCm) ).toFixed(2);
    }

    console.log(bmiDetails);
}