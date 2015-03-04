;(function () {

  angular.module('Top5', ['ngRoute', 'ngCookies'])

  .constant('PARSE', {
    
    URL:'https://api.parse.com/1/',
    CONGIG: {
      headers: {
          'X-Parse-Application-Id': 'TGTGRdNU2m3wCWDbM8An5C6wRsoUWDBhXlwFKsAO',
          'X-Parse-REST-API-Key':   'AqghD34BhsCJmyOpdGrUcTahmXL7hFzXoFP4cgf0',
          'Content-Type':           'application/json'
        }
      }
     }) 

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider
          .when('/' , {
            templateUrl: 'scripts/lists/lists.home.tpl.html',
            controller: 'ListCtrl'
          })

          .when('/login', {
            templateUrl: 'scripts/users/user.login.tpl.html',
            controller: 'UserCtrl'
          })

          .when('/register', {
            template.Url: 'scripts/users/user.register.tpl.html',
            controller: 'UserCtrl'
          })

          .when('/lists/:id', {
            templateUrl: 'scripts/items/items.list.tpl.html',
            controller: 'ItemsCtrl'
          })

          .otherwise('/');

        }])

     .run(['$rootScope', 'UserFactory', 'PARSE',
        function ($rootScope, UserFactory, PARSE) {

          $rootScope.$on('$routeChangeStart', function () {

              UserFactory.status();
          })

         }         
        })

          


}());

