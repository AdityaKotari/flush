# FLUSH
##### Submitted for HackNITR 2.0


##### A Demo can be found at [https://flush-app.herokuapp.com/](https://flush-app.herokuapp.com/)

#### Tagline
Flush aims to provide quick and nearby access to sanitation and toilets in all parts of the world by creating a map of all toilets and incentivising users to add their own restrooms to the map.
#### The problems we set out to solve:
Everyone has had a point in their life where
- They require a restroom quickly due to an emergency
- Are in an unknown area but do not know where they can find a toilet
- Are displeased by the sanitary condition of the restroom(or the outdoors if one cannot find a restroom)

Flush aims to solve all these problems by creating a network where users do not need to search physically for a toilet, and also have access to more toilets. This is accomplished by:
- Letting Users identify available public toilets and mark them on the map so other Users can use this information
- Letting Users lease out their own toilets, hence adding to the supply of restrooms that one has access to

Many of us will gladly accept an **additional passive source of income**. Some of us have **spare restrooms in our house or own establishments(restaurants, stores, rented spaces, etc.)** where there are many toilets being maintained but scarcely used. Flush allows these lucky people to take advantage of these conditions and make a quick profit, while also helping Users relieve themselves in a state of dire need.

#### Tech Stack:
- Frontend: React, Material UI, MapBox
- Backend: Node.js, Express, MongoDB

#### Some additional problems that Flush solves:
- **Flush categorizes and displays** toilets according to a user's need. For example, females needing female or unisex restrooms, someone preferring toilet paper or a western toilet, etc.
- Toilets are also categorized as ones friendly to the **differently-abled**, which allows some of us who require special help find the nearest toilet that is convenient to us even when we are far from home.
- One can also lease out a bathroom for **bathing purposes**(already a very popular idea in some places, with **dedicated bathhouses and 'onsens'** that one can pay a single time for a single bath, such as in Japan or European countries)
- It provides awareness and information regarding the toilets available, which can be used by organizations to plan and provide **better sanitation** and **pinpoint areas that have a greater requirement of restrooms**.  

#### Sponsors used

- Github

#### Difficulties faced
- **MapBox not working with production React:** Mapbox has an issue where it works well it development but when you create the build files using the react scripts, some of the layers do not load(due to transpiling with webpack/babel). After many hours spent and after midnight worrying about not being able to host the app, [This issue thread on Github](https://stackoverflow.com/questions/65434964/mapbox-blank-map-react-map-gl-reactjs) on the official repo gave us the fix we needed, which was to force compaibility with old browsers in package.json. However this caused some issue with the "user location button" in the map screen, where it was oddly placed.
- We had issues working with React hooks, state, and context(some of which we ended up not using) which delayed a lot of dev work.
- **OTP/Ticketing system and a payments interface:** We had originally planned for a sophisticated OTP system where a User can get an OTP for a certain toilet along with a transactions interface for added security and ease of transaction, given enough time. However, we did not have this mentioned time to implement them in the NITR hackathon but are excited to implement them in the future. 

#### To run the project locally

First install all the dependencies in both the root directory and the */client* directory using 
```
npm install
```
Then run 
```
npm run build
```
in the */client* directory, then run
```
node ./index.js
```
in the root directory. Requires node, npm, and an internet browser.


 

