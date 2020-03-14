const player = require("play-sound")((opts = {}));
const fetch = require("isomorphic-unfetch");

require("dotenv").config();

const checkMyArea = async () => {
  let numberOfCases;

  console.log("Running");

  while (true) {
    const res = await fetch(
      "https://services1.arcgis.com/0IrmI40n5ZYxTUrV/arcgis/rest/services/CountyUAs_cases/FeatureServer/0/query?f=json&where=TotalCases%20%3C%3E%200&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=TotalCases%20desc&resultOffset=0&resultRecordCount=1000"
    );

    const data = await res.json();

    const area = data.features.find(
      place => place.attributes.GSS_NM === process.env.AREA
    );

    const newNumberOfCases = area.attributes.TotalCases;

    if (newNumberOfCases > numberOfCases) {
      console.log("FUCK");
      player.play("scream.mp3");
    }

    numberOfCases = newNumberOfCases;
  }
};

checkMyArea();
