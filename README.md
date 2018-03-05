# geoInfo
Gets information about user current position. Get coordinates from browser and then fetch information about it from Google Maps API, then, extracts and returns basic information.

## Usage
```
<script src="geoinfo.js"></script>
<script>
    geoInfo.getInfo().then(function(info){
      console.log(info);
    })
    .catch(function(error){
      console.error(error);
    });
</script>
```

