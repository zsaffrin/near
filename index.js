#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');

var getLocationFromCoordinates = function(coordinates) {
	var splitCoordinates = coordinates.split(',');

	return {
		lat: splitCoordinates[0],
		long: splitCoordinates[1],
	};
};

var getDistanceFromCoordinatesInKm = function(pointA, pointB) {
	var latA = getRadiansFromDegrees(pointA.lat);
	var latB = getRadiansFromDegrees(pointB.lat);
	var longA = getRadiansFromDegrees(pointA.long);
	var longB = getRadiansFromDegrees(pointB.long);

	var centerAngle = Math.acos(Math.sin(latA) * Math.sin(latB) + Math.cos(latA) * Math.cos(latB) * Math.cos(longB - longA));
	var radiusOfEarth = 6371;

	return centerAngle * radiusOfEarth;
};

var getRadiansFromDegrees = function(degree) {
	return degree * (Math.PI / 180);
}

program
	.arguments('<partnerFile> [distance] [coordinates]')
	.action(function(partnerFile, distance, coordinates) {
		console.info('');
		console.info('Looking for offices within %skm of %s...', distance, coordinates);
		console.info('');

		var centerLocation = getLocationFromCoordinates(coordinates);

		fs.readFile(partnerFile, function(err, data) {
			if (err) {
				throw err;
			}
			var partners = JSON.parse(data);

			partners.map(function(partner) {
				console.info(partner.organization);

				partner.offices.map(function(office) {
					var location = getLocationFromCoordinates(office.coordinates);
					var distance = getDistanceFromCoordinatesInKm(centerLocation, location);
					console.info('└─ ' + office.location + ' | Lat:' + location.lat + ' Long:' + location.long + ' | Distance:' + distance + 'km');
				});
			});

			console.info('');
		});
	})
	.parse(process.argv);
