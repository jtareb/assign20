;(function (){
  
  'use strict';

  angular.module('Top5', ['ngRoute', 'ngCookies', 'T5User'])

  .constant('PARSE', {
    URL: 'https://api.parse.com/1/',
    CONFIG: {
      headers : {
        'X-Parse-Application-Id' : 'QPhfi521jPOVih27xiiqooP9B2egqpLjKSbRDI2H',
        'X-Parse-REST-API-Key'  : '13hAN2gWrhn6RmijJ3TnZp8RRq7GkvBffVCKRvo4',
        'Content-Type' : 'application/json'
      }
    } 
  })

  .config([ '$routeProvider', function ($routeProvider) {

    $routeProvider

    // Home Page | List of Lists
    .when('/', {
      templateUrl: 'scripts/lists/lists.home.tpl.html',
      controller: 'ListCtrl'
    })

    // Login Page
    .when('/login', {
      templateUrl: 'scripts/users/user.login.tpl.html',
      controller: 'UserCtrl'
    })

    // Register page
    .when('/register', {
      templateUrl: 'scripts/users/user.register.tpl.html',
      controller: 'UserCtrl'
    })

    // Single List Page
    .when('/lists/:id', {
      templateUrl: 'scripts/items/items.list.tpl.html',
      controller: 'ItemsCtrl'
    })

    // Go Home ET
    .otherwise('/');
    
  }])

  .run([ '$rootScope', 'UserFactory', 'PARSE',

    function ($rootScope, UserFactory, PARSE) {

      $rootScope.$on('$routeChangeStart', function () {
        
        // Run my Login Status
        UserFactory.status();

      })
    
   }

  ])

}());