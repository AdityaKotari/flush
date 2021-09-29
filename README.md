
## FLUSH [(Watch demo video)](https://www.youtube.com/watch?v=Vs-9cdrkRK8)
### 🏆 Best Open Innovation Hack, [HACKNITR 2.0](https://hacknitr2.devfolio.co/submissions?show_winners=true)
### Team: @guilefoylegaurav, @AdityaKotari, @Sylamsh
#### Now harnesses the public data of over 31 thousand restrooms in the UK and Australia! 

Available at: [https://flush-app.herokuapp.com/](https://flush-app.herokuapp.com/) (This takes a few seconds sometimes when the server sleeps)


_______________
### Tagline:
Flush aims to provide quick and nearby access to sanitation and toilets in all parts of the world by creating a map of all toilets and incentivising users to add their own restrooms to the map.
### The problems we set out to solve:
Everyone has had a point in their life where
- They require a restroom quickly due to an emergency
- Are in an unknown area but do not know where they can find a toilet
- Are displeased by the sanitary condition of the restroom(or the outdoors if one cannot find a restroom)

Flush aims to solve all these problems by creating a network where users do not need to search physically for a toilet, and also have access to more toilets. This is accomplished by:
- Letting Users identify available public toilets and mark them on the map so other Users can use this information
- Letting Users lease out their own toilets, hence adding to the supply of restrooms that one has access to

Many of us will gladly accept an **additional passive source of income**. Some of us have **spare restrooms in our house or own establishments(restaurants, stores, rented spaces, etc.)** where there are many toilets being maintained but scarcely used. Flush allows these lucky people to take advantage of these conditions and make a quick profit, while also helping Users relieve themselves in a state of dire need.

### Tech Stack:
- Frontend: React, Material UI, Google Maps API
- Backend: Node.js, Express, MongoDB
### Restroom data used:
- [UK](https://www.toiletmap.org.uk/about), where we imported more than 13k restrooms
- [Australia](https://data.gov.au/data/dataset/national-public-toilet-map), where we found data for more than 18k restrooms

Please note that a local instance without the connection string to our mongoDB atlas instance will NOT have this data. 

This data can only be accessed through the demo(or the links provided)


### More detail about problems that Flush solves:
- **Flush categorizes and displays** toilets according to a user's need. For example, females needing female or unisex restrooms, someone preferring toilet paper or a western toilet, etc.
- Toilets are also categorized as ones friendly to the **differently-abled**, which allows some of us who require special help find the nearest toilet that is convenient to us even when we are far from home.
- One can also lease out a bathroom for **bathing purposes**(already a very popular idea in some places, with **dedicated bathhouses and 'onsens'** that one can pay a single time for a single bath, such as in Japan or European countries)
- It provides awareness and information regarding the toilets available, which can be used by organizations to plan and provide **better sanitation** and **pinpoint areas that have a greater requirement of restrooms**.  
- Last but perhaps the **most significant**, is that Flush helps in decreasing the instances of **open defecation** around the world, by providing alternate spots to relieve one self as mentioned above.


## To run the project locally
##### This requires installation of the npm package. 

##### This also requires environment variables in
 - the *root* directory, in an *.env* file, namely a *jwt_secret* and a mongodb connection string, which will look like this: 
  
 ```
 jwt_secret = some.alphanumeric.string 
 dbstring = mongodb://user:password@host:port/database?options...
 ```
  - the */client*, in an *.env* file, namely the Google Maps API key, which will look like this:
```
REACT_APP_GOOGLE_MAPS_API_KEY = some.alphanumeric.string
```
_______________


First install all the dependencies in both the *root* directory and the */client* directory using 
```
npm install
```
Then run 
```
npm run build
```
in the */client* directory.

Then run
```
node ./index.js
```
in the *root* directory. 

 

