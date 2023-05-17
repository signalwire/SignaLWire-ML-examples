#!/usr/bin/env perl
use CGI;
use Data::Dumper;
use JSON;
use UUID 'uuid';
use File::Slurp;

my $q    = new CGI;
my $json = JSON->new->allow_nonref->pretty->utf8;
my $zone = $ENV{TIMEZONE} || "America/Chicago";

print $q->header("application/json");

my $json_text = $q->param( 'POSTDATA' );
my $post_data = $json->decode( $json_text );
(my $app_name = $post_data->{"app_name"}) =~ s/[^\w\d\-]//g;
my $uuid      = uuid();

open(L, ">>$ENV{LOG_DIR}/post.log");
my $pretty = $json->pretty->encode($post_data);
print L "\nPOSTDATA: $pretty\n";
close L;

if ($post_data->{"action"} eq "fetch_conversation") {
    if ($post_data->{"conversation_id"}) {
	my $summary = read_file("$ENV{LOG_DIR}/$post_data->{'conversation_id'}");
	if ($summary) {
	    print $json->encode({ response => "Conversation found",
						conversation_summary => $summary });
	} else {
	    print $json->encode({ response => "No previous conversation found" });
	}
    }
}

if ($post_data->{"conversation_id"} && $post_data->{"conversation_summary"}) {
    my $dt = DateTime->now;    
    my $tz = DateTime::TimeZone->new(name => $zone);
    $dt->set_time_zone($tz);
    my $formatted_time = $dt->strftime("%D %I:%M%p CT");
    
    open L, qq#>>$ENV{LOG_DIR}/$post_data->{'conversation_id'}#;
    my $txt = $post_data->{"conversation_summary"};
    chomp($txt);
    print L qq#- Call $formatted_time: $txt\n#;
    close L;
}

if ($app_name) {
    open L, ">$ENV{LOG_DIR}/${app_name}-${uuid}";
    print L $json_text;
    close L;
}
print $json->encode({ response => "data received" });
