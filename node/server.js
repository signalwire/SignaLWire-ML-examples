const SignalWireML = require('./SignalWireML');
var express = require('express');
var app = express();
app.post('/swml', function (req, res) {
    const swml = new SignalWireML({ version: '1.0.1', voice: 'en-US-Neural2-J' });
    swml.addAIparams({ languagesEnabled: 'false' });
    swml.addAIparams({ languageMode: 'normal' });

    swml.setAIprompt({
        temperature: '0.3',
        topP: '0.4',
        text: 'You are a cable internet technical support agent at Vyve Broadband, Start the conversation with how may I help you and then talk the customer thru troubleshooting, Also for billing questions you can call 855 557 8983',
    });
    swml.setAIpostPrompt({
        text:'Summarize the conversation'
    })
    swml.setAIhints("internet", "cable", "speed");
    swml.setAIpostPromptURL({postPromptURL: 'prod'});
    swml.addAISWAIGdefaults({webHookURL: "test.com"});
    swml.addAISWAIGfunctions({
        function: 'get_weather', purpose: "To determine what the current weather is in a provided location.",
        arugment:"The location or name of the city to get the weather from."  });
    swml.addAISWAIG({function:'get_world_time', purpose:"To determine what the current time is in a provided location.",
		     argument:"The location or name of the city to get the time from.", webHookURL:"test2.com"
		    });
    swml.addAIApplication("main");
    res.contentType('application/json');
    resp =swml.renderJSON()
    res.send(resp);
 })
  
 var server = app.listen(80, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log(" app listening at http://%s:%s", host, port)
 });
