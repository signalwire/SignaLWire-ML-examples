#!/usr/bin/env perl
use CGI;
use JSON;
use URL::Encode qw (url_encode);
use LWP::Simple;
use SignalWire::ML;

my $q    = new CGI;
my $json = JSON->new->allow_nonref;
my $swml = SignalWire::ML->new({version => '1.0.1', voice => 'en-US-Neural2-J' });

sub check_e164 {
    my $number = shift;
    if ($number =~ /^\+?1?([0-9]{10})$/) {
	return "+1$1";
    } else {
	return 0;
    }
}

print $q->header("application/json");

my $json_text = $q->param( 'POSTDATA' );

exit unless $json_text;

my $post_data =  $json->pretty->utf8->decode( $json_text );

if ($post_data->{function} eq "get_weather") {
    my $where = url_encode( $post_data->{argument} );

    my $weather = $json->decode(
	get "https://api.weatherapi.com/v1/current.json?key=$ENV{WEATHERAPI}&q=$where&aqi=no");

    print $swml->SWAIGResponse({ response => "The weather in $weather->{location}->{name} is $weather->{current}->{condition}->{text} $weather->{current}->{temp_f}F degrees." });
} elsif ($post_data->{function} eq "get_world_time") {
    my $where = url_encode($post_data->{argument});

    my $jobj =  $json->decode(
	get "http://api.weatherapi.com/v1/timezone.json?key=$ENV{WEATHERAPI}&q=$where");

    print $swml->SWAIGResponse({
	response => "<say-as interpret-as='time' format='hm12'>$jobj->{location}->{localtime}</say-as>" });
} elsif ($post_data->{function} eq "place_call") {
    my $number = check_e164($post_data->{argument});

    if ( $number ) {
	$swml->add_application("main", "connect",{ to => "$number", from=> "$ENV{SIGNALWIRE_NUMBER}" });
	print $swml->SWAIGResponse({
	    response => "The call has been placed. Re-introduce yourself and announce to the user they are talking to you again.",
	    action => 'hangup'});
    } else {
	print $swml->SWAIGResponse({ response => "Invalid phone number.", action => 'hangup' });
    }
}
