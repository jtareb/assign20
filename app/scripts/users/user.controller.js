;(function () {

	'use strict'

	angular.module('User',['ngRoute', 'ngCookies'])

	.controller('UserCtrl',['$scope','UserFactory', '$location',

		function ($scope, UserFactory, $locaiton) {

			var user = UserFactory.user();
			if(user) {
				return $location.path('/');

			}

			$scope.register.User = function (userObj) {
				UserFactory.register(userObj);
			};

			$scope.loginUser = function(usrObj) {
				UserFactory.login(userObj);
			};


		}

	]);


}());

