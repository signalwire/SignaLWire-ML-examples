// main.ts
import SignalWireML from './signalwireml';

const swml = new SignalWireML({});

swml.add_ailanguage({ name: "English", code: "en-US", voice: "en-US-Neural2-F" });
swml.add_aiparams({ smsFromNumber: '+19184588888' });
swml.add_aiparams({ languagesEnabled: 'true' });
swml.add_aiparams({ languageMode: 'normal' });
swml.set_aiprompt({ temperature: "0.9", top_p: "0.9", text: "Your name is Franklin and you are an expert at Star Wars. Introduce yourself and see if I have any questions." });
swml.set_aipost_prompt({ text: "Please summarize the conversation." });
swml.add_aihints("foo", "bar");

swml.add_aiswaigdefaults({ web_hook_url: "$ENV{webHookURL}" });

swml.add_aiswaigfunction({
  "function": 'get_weather', purpose: "To determine what the current weather is in a provided location.",
  argument: "The location or name of the city to get the weather from."
});

swml.add_aiswaigfunction({
  "function": 'get_world_time', purpose: "To determine what the current time is in a provided location.",
  argument: "The location or name of the city to get the time from."
});


swml.add_aiinclude({
  url: "https:/$ENV{WEB_AUTH_USER}:$ENV{WEB_AUTH_PASSWORD}@swaig-server.example.com/",
  functions: "transfer",
  meta_data_token: '6a524622-c6aa-4311-aad7-ebf4d3e06879',
  meta_data: {
    table: {
      brian: "$ENV{BRIAN_CELL}",
      support: 'sip:support@pbx.example.com;transport=tcp',
      sales: 'sip:sales@pbx.example.com;transport=tcp',
      carrier: 'sip:carrier@pbx.example.com;transport=tcp'
    },
    config: {
      response: "call transferred, the call has ended.",
      message: "Please stand by while I connect your call.",
      error: "I'm sorry, I was unable to transfer your call.",
      hangup: "true"
    }
  }
});

swml.add_aiinclude({
  url: "https:/$ENV{WEB_AUTH_USER}:$ENV{WEB_AUTH_PASSWORD}@swaig-server.example.com/",
  functions: "something_else",
  meta_data_token: '6a524622-c6aa-4311-aad7-ebf4d3e06879',
  meta_data: {
    table: {
      brian: "$ENV{BRIAN_CELL}",
      support: 'sip:support@pbx.example.com;transport=tcp',
      sales: 'sip:sales@pbx.example.com;transport=tcp',
      carrier: 'sip:carrier@pbx.example.com;transport=tcp'
    },
    config: {
      response: "call transferred, the call has ended.",
      message: "Please stand by while I connect your call.",
      error: "I'm sorry, I was unable to transfer your call.",
      hangup: "true"
    }
  }
});

swml.add_ainativefunction('check_time');
swml.add_ainativefunction('wait_seconds');

swml.add_aipronounce({ replace: 'signalwire', with: 'signal wire', ignore_case: 'true' })

swml.add_aiapplication("main");


swml.add_application("test", "play",
  { urls: ['https://github.com/freeswitch/freeswitch-sounds/raw/master/fr/ca/june/voicemail/48000/vm-goodbye.wav'] });
swml.add_application("test", "hangup", "NORMAL_CLEARING");
swml.add_application("blah", "play",
  { urls: ['https://github.com/freeswitch/freeswitch-sounds/raw/master/en/us/callie/ivr/48000/ivr-welcome_to_freeswitch.wav'] });
swml.add_application("blah", "transfer", "test");

const json_output = swml.render_json();
console.log(json_output);




