```
# 1. Obtain a weatherapi.com API key
https://www.weatherapi.com

# 2. Create a .env file using the API key from step 1 and populate it as follows:
WEATHER_API_KEY=xxxxx

# 3. Add the following variables to the .env created above:
FQDN=xxx.example.com
PORT=3000

# 4. Build the docker image
docker build -f Dockerfile -t example:0.0.1 .

# 4. Start the container
docker run -d -it --rm --env-file ./.env -p 3000:3000 --name example example:0.0.1



# If you have typescript and node installed locally, you can Build and run the SWML Demo 
cd demo
tsc swml-demo.ts
node swml-demo.js
```
