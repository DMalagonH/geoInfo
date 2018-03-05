var geoInfo = (function() {

	const GoogleApiKey = "";

	/**
	 * Returns Google Maps API endpoint with parameters
	 *
	 * @param number latitude
	 * @param number longitude
	 * @return endpoint
	 */
	var getEndpoint = function(latitude, longitude) {
		return "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=false&key=" + GoogleApiKey;
	}

	/**
	 * Gets current location coords and information from Google Maps API
	 *
	 * @return Promise (resolve returns an object with coords and info about location)
	 */
	var getGeoInfo = function() {
		var latitude, longitude;

		return new Promise(function(resolve, reject) {
			// Get position
			getCurrentPosition().then(function(position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;

				// Get data about position
				return fetchLocationData(latitude, longitude);
			})
			.then(function(geoData){
				// Extract basic info about location
				var info = extractLocationData(geoData);

				// Add coords
				info.latitude = latitude;
				info.longitude = longitude;

				resolve(info);
			})
			.catch(function(error) {
				reject(error);
			});
		});
	}

	/**
	 * Gets coords of current position
	 *
	 * @return Promise (return an object with coords)
	 */
	var getCurrentPosition = function(){
		return new Promise(function(resolve, reject){
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position){
					resolve(position);
				}, function(err){
					reject(err);
				});
			} else {
				reject("Unsupported Geolocation");
			}
		});
	}

	/**
	 * Fetches location data from Google Maps API
	 *
	 * @param number latitude
	 * @param number longitude
	 * @return Promise (returns location data from google api)
	 */
	var fetchLocationData = function(latitude, longitude) {
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", getEndpoint(latitude, longitude), true);
			xhr.onreadystatechange = function(){
				if (xhr.readyState == 4) {
					if(xhr.status == 200) {
						var response = JSON.parse(xhr.responseText);
						if (response.status == "OK") {
							resolve(response.results);
						} else {
							reject("API response status" + response.status);
						}
					} else {
						reject("XHR response status " + xhr.status);
					}
				}
			};
			xhr.send();
		});
	}

	/**
	 * extracts location information from google response data
	 *
	 * @param object googleGeoData google response data
	 * @return object extracted information                                                                                                     [description]
	 */
	var extractLocationData = function(googleGeoData) {
		let found = false;
		let geoData = {
			city:			null,
			neighborhood:	null,
			sublocality:    null,
			postalCode:		null,
			country:		null,
			countryCode:	null
		};

		for (var il in googleGeoData) {
			var location = googleGeoData[il];
			for (var ic in location['address_components']) {
				var component = location['address_components'][ic];
				// city
				if (component.types.indexOf('locality') !== -1 && geoData.city == null) {
					geoData.city = component.long_name;
				}
				// country
				else if (component.types.indexOf('country') !== -1 && (geoData.country == null || geoData.countryCode == null)) {
					geoData.country = component.long_name;
					geoData.countryCode = component.short_name;
				}
				// postal code
				else if (component.types.indexOf('postal_code') !== -1 && geoData.postalCode == null) {
					geoData.postalCode = component.long_name;
				}
				// sublocality
				else if (component.types.indexOf('sublocality') !== -1 && geoData.sublocality == null) {
					geoData.sublocality = component.long_name;
				}
				// neighborhood
				else if (component.types.indexOf('neighborhood') !== -1 && geoData.neighborhood == null) {
					geoData.neighborhood = component.long_name;
				}

				found = checkFound(geoData);
				if (found) break;
			}
			if (found) break;
		}

		return geoData;
	}

	/**
	 * Checks if searched location atributes were found
	 *
	 * @param object geoData extracted data
	 * @return boolean
	 */
	var checkFound = function(geoData) {
		for (let key in geoData) {
			if (geoData[key] === null) {
				return false;
			}
		}
		return true;
	}

	return {
		getInfo: getGeoInfo,
		getCurrentPosition: getCurrentPosition
	};
}());
