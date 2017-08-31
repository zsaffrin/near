#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');

var getLocationFromCoordinates = function(coordinates) {
	var split = coordinates.split(',');

	return {
		lat: split[0],
		long: split[1],
	};
};

var getDistanceFromCoordinatesInKm = function(pointA, pointB) {
	var latA = degToRad(pointA.lat);
	var latB = degToRad(pointB.lat);
	var longA = degToRad(pointA.long);
	var longB = degToRad(pointB.long);

	var centerAngle = Math.acos(Math.sin(latA) * Math.sin(latB) + Math.cos(latA) * Math.cos(latB) * Math.cos(longB - longA));
	var radiusOfEarth = 6371;

	return centerAngle * radiusOfEarth;
};

var degToRad = function(degree) {
	return degree * (Math.PI / 180);
}

var buildOfficeListWithDistance = function(partners, center) {
	var officeList = [];

	partners.map(function(partner) {
		partner.offices.map(function(office) {
			var location = getLocationFromCoordinates(office.coordinates);
			var distance = getDistanceFromCoordinatesInKm(center, location);

			var officeEntry = {
				partner: partner.organization,
				location: office.location,
				coordinates: office.coordinates,
				distance: Math.floor(distance),
			}

			return officeList.push(officeEntry);
		});
	});

	return officeList.sort(function(a, b) {
		return a.partner.localeCompare(b.partner);
	});
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

			var offices = buildOfficeListWithDistance(partners, centerLocation);
			offices = offices.filter(function(office) {
				return office.distance <= distance;
			});
			offices.map(function(office) {
				return console.info(office.partner + ' ' + office.location + ' ' + office.distance + 'km');
			});

			console.info('');
		});
	})
	.parse(process.argv);
