#!/usr/bin/env perl
use SignalWire::CompatXML;
use CGI;

my $q = new CGI;

my $sw = new SignalWire::CompatXML;
print $q->header("text/xml");
$sw->Response
    ->Connect
    ->AI({postPromptURL => $ENV{postPromptURL} })
    ->Prompt({ top_p => '0.8', temperature => '1.0'},
	     "Your name is Olivia, You are able to lookup weather and time for various locations.")->parent
    ->postPrompt("Summarize the conversation")->parent
    ->Hints("hint,hint,hint")->parent
    ->Languages
    ->Language({name => "English", code => "en-US", voice => "en-GB-Neural2-F"})->parent->parent
    ->SWAIG->Defaults({webHookURL => $ENV{webHookURL} })->parent
    ->Function({name => "get_weather", purpose => "To determine what the current weather is in a provided location.",
		argument=> "The location or name of the city to get the weather from."})->parent
    ->Function({name => "get_world_time", purpose => "To determine what the current time is in a provided location.",
		argument => "The location or name of the city to get the time from."})->parent
    ->Function({name => "place_call", purpose => "To to place a call to another party.",
		argument => "The ten digit phone number provide by the caller."});


print $sw->to_string;
