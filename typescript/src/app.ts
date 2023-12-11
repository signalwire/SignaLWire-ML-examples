// app.ts
import SignalWireML from './signalwireml';
import express from 'express';
import "dotenv/config";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const FQDN = process.env.FQDN;
const PORT = process.env.PORT;

const app = express();
app.use(express.json());


app.post("/post_prompt_url", async (req, res) => {
  console.log("Post Prompt URL\n");
  var data = JSON.stringify(req.body);
  console.log(data);
});


app.post("/weather", async (req, res) => {
  console.log("Get Weather URL\n");
  console.log(req.body);
  var location = req.body.argument.parsed[0].location;

  var url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q='${location}'&api=no`;
  var resp = await fetch(url);
  var body = await resp.text();
  var weather = JSON.parse(body);
  console.log("Weather:\n", weather);

  var current = {"response": `The current weather in ${location} is ${weather.current.condition.text} with a temperature ${weather.current.temp_f} and it feels like ${weather.current.feelslike_f} degrees`};

  res.contentType('application/json');
  res.json(current);
});



app.post("/", async (req, res) => {
  console.log(req.body);
  const params = req.body.argument?.parsed[0];
  console.log(params);

  const swml = new SignalWireML({ version: "1.0.0"});

  swml.add_ailanguage({ name: "English (US)", code: "en-US", voice: "en-US-Neural2-F", engine: "gcloud" });

  swml.add_aiparams({ local_tz: 'America/New_York' });
  swml.add_aiparams({ ai_model: 'gpt-3.5-turbo' });
  swml.add_aiparams({ end_of_speech_timeout: '1000' });

  swml.set_aiprompt({
    temperature: '0.3',
    top_p: '0.4',
    text: "You are able to get the weather for a specific location by calling the get_weather function."
  });

  swml.set_aipost_prompt({
    text:'Summarize the conversation'
  });

  swml.set_aipost_prompt_url(`http://${FQDN}:${PORT}/post_prompt_url`);

  swml.add_aiswaigfunction({
    "function": 'get_weather',
    purpose: "To determine what the current weather is in a provided location.",
    "argument": {
       "type": "object",
       "properties": {
         "location": {
           "type": "string",
           "description": "The location or name of the city to get the weather from",
         }
       }
    },
    web_hook_url: `http://${FQDN}:${PORT}/weather`
  });

  swml.set_aihints("weather");

  swml.add_aiapplication("main");
  res.contentType('application/json');
  var resp = swml.render_json();
  console.log("Response:", resp);
  res.send(resp);
});


app.listen(PORT, async () => {
  console.log(`Example app is listening on port ${PORT}`);
});
