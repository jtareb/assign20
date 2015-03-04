;(function (){
  
  'use strict';

  angular.module('Top5')

  .controller('NavCtrl', ['$scope', 'UserFactory', 

    function ($scope, UserFactory) {

      console.log('here');
    
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