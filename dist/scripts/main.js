;(function (){
  
  'use strict';

  angular.module('Top5', ['ngRoute', 'ngCookies', 'T5User'])

  .constant('PARSE', {
    URL: 'https://api.parse.com/1/',
    CONFIG: {
      headers : {
        'X-Parse-Application-Id' : 'TGTGRdNU2m3wCWDbM8An5C6wRsoUWDBhXlwFKsAO',
        'X-Parse-REST-API-Key'  : 'AqghD34BhsCJmyOpdGrUcTahmXL7hFzXoFP4cgf0',
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
;(function (){
  
  'use strict';

  angular.module('Top5')

  .controller('NavCtrl', ['$scope', 'UserFactory', 

    function ($scope, UserFactory) {
    
      var user = UserFactory.user();

      if (user) {
        $scope.loggedin = true;
        $scope.user = user;
      } else {
        $scope.loggedin = false;
      }


      $scope.logout = function () {
        UserFactory.logout();
      };  


    }

  ])

}());
;(function (){
  
  'use strict';

  angular.module('T5User', ['ngRoute', 'ngCookies'])

  .controller('UserCtrl', ['$scope', 'UserFactory', '$location', 

    function ($scope, UserFactory, $location) {

      // If Currently Logged in - Leave this controller
      var user = UserFactory.user();
      if (user) {
        return $location.path('/');
      }

      // Add a new user
      $scope.registerUser = function (userObj) {
        UserFactory.register(userObj);
      };

      // Login Method
      $scope.loginUser = function (userObj) {
        UserFactory.login(userObj);
      };
    
    }

  ]);

}());
;(function (){
  
  'use strict';

  angular.module('T5User')

  .factory('UserFactory', ['$http', 'PARSE', '$cookieStore', '$location',

    function ($http, PARSE, $cookieStore, $location) {
    
      // Get Current User
      var currentUser = function () {
        return $cookieStore.get('currentUser');
      };

      // Check User Status
      var checkLoginStatus = function () {
        var user = currentUser();
        if (user) {
          PARSE.CONFIG.headers['X-PARSE-Session-Token'] = user.sessionToken;
        }
      };

      // Add a new User
      var addUser = function (userObj) {
        $http.post(PARSE.URL + 'users', userObj, PARSE.CONFIG)
          .then( function (res) {
            console.log(res);
          }
        );
      };

      // Log in a User
      var loginUser = function (userObj) {

        $http({
          method: 'GET',
          url: PARSE.URL + 'login',
          headers: PARSE.CONFIG.headers,
          params: userObj
        }).then (function (res) {
          console.log(res);
          $cookieStore.put('currentUser', res.data);
        });
        
      };

      // Logout Method
      var logoutUser = function () {
        $cookieStore.remove('currentUser');
        $location.path('/login');
      }
  
      return {
        register : addUser, 
        login : loginUser,
        user : currentUser,
        status : checkLoginStatus,
        logout : logoutUser
      };

    }

  ]);

}());
;(function (){
  
  'use strict';

  angular.module('Top5')

  .controller('ListCtrl', ['$scope', 'ListsFactory', '$cacheFactory',

    function ($scope, ListsFactory, $cacheFactory) {

      var cache = $cacheFactory.get('$http');

      $scope.lists = [];

      ListsFactory.get().success( function (response) {
        $scope.lists = response.results;
      });
    
      $scope.addList = function (listObj) {
        $scope.list = {};
        ListsFactory.add(listObj).success( function (results) {
          listObj.objectId = results.objectId;
          $scope.lists.push(listObj);
          cache.remove('https://api.parse.com/1/classes/Lists');
        });
      };

      $scope.deleteMe = function (id, index) {
        ListsFactory.del(id).success( function (response) {
          $scope.lists.splice(index, 1);
          cache.remove('https://api.parse.com/1/classes/Lists');
        });
      };

    }

  ])

}());
;(function (){
  
  'use strict';

  angular.module('Top5')

  .factory('ListsFactory', ['$http', 'PARSE', 'UserFactory',

    function ($http, PARSE, UserFactory) {

      var user = UserFactory.user();

      var getAllLists = function () {
        return $http.get(PARSE.URL + 'classes/Lists', {
          headers: PARSE.CONFIG.headers,
          cache: true
        });
      };

      var addList = function (listObj) {
        // Add User Pointer to my list object
        listObj.user = {
          __type: 'Pointer',
          className: '_User',
          objectId: user.objectId
        }

        // Set up Access Control
        var ACLObj = {};
        ACLObj[user.objectId] = {
          'read' : true,
          'write' : true
        }

        listObj.ACL = ACLObj;

        return $http.post(PARSE.URL + 'classes/Lists', listObj, PARSE.CONFIG);
      };

      var deleteList = function (id) {
        return $http.delete(PARSE.URL + 'classes/Lists/' + id, PARSE.CONFIG);
      };
    
  
      return {
        get : getAllLists,
        add : addList,
        del : deleteList
      };

    }

  ])

}());
;(function (){
  
  'use strict';

  angular.module('Top5')

  .controller('ItemsCtrl', ['$scope', 'ItemsFactory', '$routeParams',

    function ($scope, ItemsFactory, $routeParams) {

      $scope.listTitle = '';
      $scope.items = [];

      ItemsFactory.listTitle($routeParams.id).success ( function (data) {
        $scope.listTitle = data.title;
      });

      ItemsFactory.get($routeParams.id).success( function (data) {
        $scope.items = data.results;
      });

      $scope.addItem = function (itemObj) {
        ItemsFactory.add(itemObj, $routeParams.id)
          .success( function (res) {
            $scope.item = {};
            $scope.items.push(itemObj);
          }
        );
      };
    
    }

  ]);

}());
;(function (){
  
  'use strict';

  angular.module('Top5')

  .factory('ItemsFactory', ['$http', 'PARSE', 'UserFactory',

    function ($http, PARSE, UserFactory) {

      var user = UserFactory.user();

      var getListTitle = function (listId) {
        return $http.get(PARSE.URL + 'classes/Lists/' + listId, {
          headers: PARSE.CONFIG.headers,
          cache: true
        });
      };
    
      var getSingleList = function (listId) {

        return $http.get(PARSE.URL + 'classes/Items', {
          headers: PARSE.CONFIG.headers,
          params: {
            where: {
              list: {
                __type: 'Pointer',
                className: 'Lists',
                objectId: listId
              }
            }
          },
          cache: true
        });

      };

      var addListItem = function (itemObj, listId) {

        // Add User to Item
        itemObj.user = {
          __type: 'Pointer',
          className: '_User',
          objectId: user.objectId
        }

        // Add List to Item
        itemObj.list = {
          __type: 'Pointer',
          className: 'Lists',
          objectId: listId
        }

        // ACL
        var ACLObj = {};
        ACLObj[user.objectId] = { read: true, write: true };
        itemObj.ACL = ACLObj;

        return $http.post(PARSE.URL + 'classes/Items', itemObj, PARSE.CONFIG);

      };

      var deleteListItem = function () {

      };
  
      return {
        get: getSingleList,
        add: addListItem,
        del: deleteListItem,
        listTitle: getListTitle
      };
    }
  ])

}());