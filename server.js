// require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("home.html", "utf-8");
function replaceData(data, code){
  // console.log(code);
    let home =  homeFile.replace("{%City%}", data.location.name)
    home =  home.replace("{%Country%}", data.location.country)
    home =  home.replace("{%Temp%}", data.current.temp_c)
    home =  home.replace("{%status%}", code)
    return home;
}

const estimateAssets = (code)=>{
  if(code==1000){
    return "Clear"
  }else if(code>1000 && code<1031){
    return "Clouds"
  }else if(code in [1063, 1066, 1069, 1072, 1087, 1114, 1117, 1135, 1147, 1150, 1153]){
    return "Haze"
  }else if(code in [1246, 1243, 1240, 1201, 1198, 1195, 1192, 1189, 1186, 1183, 1180, 1171, 1168]){
    return "Rain"
  }else if(code in [1264, 1261, 1258, 1255, 1252, 1249, 1237, 1225, 1222, 1219, 1216, 1213, 1210, 1207, 1204]){
    return "Snow"
  }else if(code in [1282, 1279, 1276]){
    return "Thunderstorm"
  }
}

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `https://api.weatherapi.com/v1/current.json?key=6f20062dafb2481c9a6182817232307&q=Bhubaneswar&aqi=no`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        // const arrData = [objdata];
        // // console.log(arrData[0].main.temp);
        // const realTimeData = arrData
        //   .map((val) => replaceVal(homeFile, val))
        //   .join("");
        // console.log(objdata);
        const code = estimateAssets(objdata.current.condition.code)
        const data = replaceData(objdata, code)
        // console.log(data);
        res.write(data);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{console.log("Server is running)});
