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