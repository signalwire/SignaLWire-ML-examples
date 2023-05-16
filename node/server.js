const SignalWireML = require('./SignalWireML');
var express = require('express');
var app = express();
app.post('/swml', function (req, res) {
    const swml = new SignalWireML({ version: '1.0.1', voice: 'en-US-Neural2-J' });
    swml.add_aiparams({ languages_enabled: 'false' });
    swml.add_aiparams({ language_mode: 'normal' });

    swml.set_aiprompt({
        temperature: '0.3',
        topP: '0.4',
        text: 'You are a cable internet technical support agent at Vyve Broadband, Start the conversation with how may I help you and then talk the customer thru troubleshooting, Also for billing questions you can call 855 557 8983',
    });
    swml.set_aipost_prompt({
        text:'Summarize the conversation'
    })
    swml.set_aihints("internet", "cable", "speed");
    swml.set_aipost_prompt_url({post_prompt_url: 'prod'});
    swml.add_aiswaigdefaults({web_hook_url: "test.com"});
    swml.add_aiswaigfunctions({
        function: 'get_weather', purpose: "To determine what the current weather is in a provided location.",
        arugment:"The location or name of the city to get the weather from."  });
    swml.add_aiswaig({function:'get_world_time', purpose:"To determine what the current time is in a provided location.",
		     argument:"The location or name of the city to get the time from.", web_hook_url:"test2.com"
		    });
    swml.add_aiapplication("main");
    res.content_type('application/json');
    resp =swml.render_json()
    res.send(resp);
 })
  
 var server = app.listen(80, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log(" app listening at http://%s:%s", host, port)
 });
