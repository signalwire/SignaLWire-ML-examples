#!/usr/bin/env perl
use strict;
use warnings;
use CGI;
use SignalWire::ML;
use Data::Dumper;

my $q = CGI->new;

my $swml = SignalWire::ML->new({version => '1.0.2', voice => 'en-GB-Neural2-F' });

$swml->setAIprompt({
    temperature => "0.9",
    topP => "1.0",
    text => "Your name is Olivia, You are able to lookup weather and time for various locations." });
$swml->setAIpostPrompt({ text => "Summarize the conversation" });

$swml->addAIhints("jokes", "weather", "time");

$swml->setAIpostPromptURL({ postPromptURL => $ENV{postPromptURL} });

$swml->addAISWAIGdefaults({ webHookURL => "$ENV{webHookURL}" });

$swml->addAISWAIGfunction({
    function => 'get_weather',
    purpose => "To determine what the current weather is in a provided location.",
    argument => "The location or name of the city to get the weather from." });

$swml->addAISWAIGfunction({
    function => 'get_world_time',
    purpose => "To determine what the current time is in a provided location.",
    argument => "The location or name of the city to get the time from." });

$swml->addAISWAIGfunction({
    function => 'place_call',
    purpose => "To to place a call to another party.",
    argument => "The ten digit phone number provide by the caller" });

$swml->addAIApplication("main");

print $q->header("application/json");
print $swml->renderJSON;
