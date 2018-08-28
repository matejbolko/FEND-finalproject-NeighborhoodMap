# fend-finalproject-neighborhoodmap

## Depencencies

google-maps-react for Google Map API  
google maps API key  
axios

### How to run project
1. clone or download project

2. rename file src\Config_template.js to src\Config.js

3. register @ developers.google.com and put your API token in config file
about google maps api read more at: https://developers.google.com/maps/documentation/javascript/get-api-key

4. register @ foursquare.com/developers/apps and put your ClientID and Client secret in file

5. change the working directory and run  
npm install  
npm start  

### Offline mode
The service worker is only enabled in the production environment, e.g. the output of npm run build. It's recommended that you do not enable an offline-first service worker in a development environment, as it can lead to frustration when previously cached assets are used and do not include the latest changes you've made locally.
more: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#offline-first-considerations