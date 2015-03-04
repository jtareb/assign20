;(function () {

	'use strict'

	angular.module('Top5')

		.factory('UserFactory', ['$http', 'PARSE', '$cookieStore', '$location',

			function ($http, PARSE, $cookieStore, $location) {

				var currentUser = function () {
					return $cookieStore.get('currentUser');
				};
			
				var checkLoginStatus = function () {
					var user = currentUser();
					if (user) {
						 PARSE.CONFIG.headers['X-PARSE-Session-Token'] = user.sessionToken;
				  }
				};

				var addUser = function(userObj) {
					 $http.post(PARSE.URL + 'users', userObj, PARSE.CONFIG)
					 .then( function (res) {
					 	//console.log(res)
					 }
				};
			};

				








}());