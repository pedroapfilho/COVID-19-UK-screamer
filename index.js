const puppeteer = require("puppeteer");
var player = require("play-sound")((opts = {}));

require("dotenv").config();

const checkMyArea = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  await page.goto(
    "https://www.gov.uk/government/publications/coronavirus-covid-19-number-of-cases-in-england/coronavirus-covid-19-number-of-cases-in-england",
    {
      waitUntil: "networkidle0"
    }
  );

  let numberOfCases;

  console.log("Running");

  while (true) {
    const data = await page.$$eval("table tr td", tds =>
      tds.map(td => {
        return td.innerHTML;
      })
    );

    const indexOfArea = data.indexOf(process.env.AREA);

    const newNumberOfCases = Number(data[indexOfArea + 1]);

    if (newNumberOfCases > numberOfCases) {
      console.log("FUCK");
      player.play("scream.mp3", err => {
        if (err) throw err;
      });
    }

    numberOfCases = newNumberOfCases;

    await page.waitFor(10000);

    await page.reload();
  }
};

checkMyArea();
