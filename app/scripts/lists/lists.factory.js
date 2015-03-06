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
        listObj.user = {
          __type: 'Pointer',
          className: '_User',
          objectId: user.objectId
        }

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