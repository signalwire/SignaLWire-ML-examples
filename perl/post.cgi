#!/usr/bin/env perl
use CGI;
use Data::Dumper;
use JSON;
use UUID 'uuid';

my $q    = new CGI;
my $json = JSON->new->allow_nonref;

print $q->header("application/json");

my $json_text = $q->param( 'POSTDATA' );

if ($json_text) {
    my $post_data = $json->decode( $json_text );
    my $app_name  = $post_data->{"appName"};
    $app_name     =~ s/[^\w\d\-]//g;
    my $uuid      = uuid();

    if ($app_name) {
	open L, ">$ENV{LOG_DIR}/${app_name}-${uuid}";
	print L $json_text;
	close L;
    }
}
print $json->pretty->utf8->encode({ response => "data received" });
