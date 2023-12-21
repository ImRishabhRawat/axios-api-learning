import express from "express";
import ejs from "ejs";
import axios from "axios";
import bodyParser from "body-parser";
import { response } from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

const API_URL = "https://api.openweathermap.org/data/2.5/weather?";
const yourApiKey = "bcecb40a9b0ac7530a24221408ff9b36";

app.get("/", (req, res) => {
	res.render("login.ejs");
});

app.post("/", async (req, res) => {
	const fname = req.body.fname;

	const city = req.body.city;
	try {
		const result = await axios.get(API_URL + "q=" + city + "&units=metric&", {
			params: {
				appid: yourApiKey,
			},
		});
		const { temp, humidity, pressure } = result.data.main;
		const { main: weathermood } = result.data.weather[0];
		const { name } = result.data;
		const { speed } = result.data.wind;
		const { country, sunset } = result.data.sys;
		var classname = "";
		if (weathermood) {
			switch (weathermood) {
				case "Clouds":
					classname = "wi-day-cloudy";
					break;
				case "Haze":
					classname = "wi-fog";
					break;
				case "Clear":
					classname = "wi-day-sunny";
					break;
				case "Rain":
					classname = "wi-rain";
					break;
				case "Mist":
					classname = "wi-dust";
					break;
				case "Smoke":
					classname = "wi-smoke";
					break;
				default:
					classname = "wi-day-sunny";
					break;
			}
		}


		let sec = sunset;
		let date = new Date(sec * 1000);
		let timeStr = `${date.getHours()}:${date.getMinutes()}`;
		res.render("login.ejs", {
			data: {
				fname: fname,
				temp: temp,
				name: name,
				country: country,
				humidity: humidity,
				speed: speed,
				weathermood: weathermood,
				pressure: pressure,
				timeStr: timeStr,
				classname:classname,
			},
		});
	} catch (error) {
		res.render("login.ejs", {
			data: "nope",
		});
	}
	// res.render("login.ejs", { name: name });
});

app.listen(port, () => {
	console.log("listening on port 3000");
});
