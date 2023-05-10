see https://github.com/signalwire/signalwire-perl/tree/master/SignalWire-ML

This demo requires https://www.weatherapi.com/, which has a free tier that includes 1 million lookups per month.

$ENV{postPromptURL}     = url to post.cgi\
$ENV{webHookURL}        = url to swaig-demo.cgi\
$ENV{WEATHERAPI}        = www.weatherapi.com API Key\
$ENV{SIGNALWIRE_NUMBER} = Phone number to place calls from


post.cgi is used to receive the postPrompt data\
laml-demom.cgi is a Compatiblity XML demo of AI\
swml-demo.cgi is a SWML example of AI\
swaig-demo.cgi is the SignalWire AI Gateway example with three functions\
