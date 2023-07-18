import json
import urllib.parse
import requests
from http.server import CGIHTTPRequestHandler, HTTPServer

class SignalWireML:
    def __init__(self):
        self.data = {}

    def add_application(self, name, method, params):
        self.data[name] = {method: params}

    def swaig_response(self, response_dict):
        self.data.update(response_dict)
        return json.dumps(self.data)

def check_e164(number):
    if number.startswith("+"):
        number = number[1:]
    if number.isdigit() and len(number) == 10:
        return "+1" + number
    return None

class MyCGIHandler(CGIHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')

        if not post_data:
            self.send_response(400)
            self.end_headers()
            return

        post_data = json.loads(post_data)

        if post_data['function'] == "get_weather":
            where = urllib.parse.urlencode({'q': post_data['argument']})
            weather_response = requests.get(f"https://api.weatherapi.com/v1/current.json?key=b27d750e8db54449ae0163438231807&{where}&aqi=no")
            weather_data = weather_response.json()
            response_text = f"The weather in {weather_data['location']['name']} is {weather_data['current']['condition']['text']} {weather_data['current']['temp_f']}F degrees."
            swml = SignalWireML()
            swml_response = swml.swaig_response({"response": response_text})
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(swml_response.encode('utf-8'))

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8080), MyCGIHandler)
    print('Starting server, use <Ctrl-C> to stop')
    server.serve_forever()




