# geoInfo
Gets information about user current position. Get coordinates from browser and then fetch information about it from Google Maps API, then, extracts and returns basic information.

## Usage
```
<script src="geoinfo.js"></script>
<script>
    // You can use Google API without key, but, it has a very short daily requests limit.
    // Remember not to use the key variable api globally, I recommend use it into a scope as a private variable
    var GoogleApiKey = ""; // your api key here.
    geoInfo.getInfo(GoogleApiKey).then(function(info){
      console.log(info);
    })
    .catch(function(error){
      console.error(error);
    });
</script>
```
