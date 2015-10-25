'use strict';

function unwrapItems(result) {
  return unwrap(result).items;
}

function unwrap(result) {
  return result.data;
}

angular.module('k8s-manager.api')
  .factory('Namespaces', ['$http', 'UrlResolver', function($http, url) {

    return {
      queryAll: function() {
        return $http.get(url.get('/namespaces')).then(unwrapItems);
      }
    };
  }])
  .factory('Events', ['$http', 'UrlResolver', function($http, url) {

    return {
      queryAll: function() {
        return $http.get(url.get('/events')).then(unwrapItems);
      }
    };
  }])
  .factory('ResourceQuotas', ['$http', 'UrlResolver', function($http, url) {
    return {
      queryAll: function() {
        return $http.get(url.get('/resourcequotas')).then(unwrapItems);
      }
    };
  }])
  .factory('Services', ['$http', 'UrlResolver', function($http, url) {
    return {
      byNamespace: function(namespace) {
        return $http.get(url.get('/namespaces/'+namespace+'/services')).then(unwrapItems);
      }
    };
  }])
  .factory('ReplicationControllers', ['$http', 'UrlResolver', function($http, url) {
    return {
      byNamespace: function(namespace) {
        return $http.get(url.get('/namespaces/'+namespace+'/replicationcontrollers')).then(unwrapItems);
      }
    };
  }])
  .factory('Pods', ['$http', 'UrlResolver', function($http, url) {
    return {
      byNamespace: function(namespace) {
        return $http.get(url.get('/namespaces/'+namespace+'/pods')).then(unwrapItems);
      },
      getPod: function(namespace, name) {
        return $http.get(url.get('/namespaces/'+namespace+'/pods/'+name)).then(unwrap);
      },
      deletePod: function(namespace, name) {
        return $http.delete(url.get('/namespaces/'+namespace+'/pods/'+name)).then(unwrap);
      },
      getPodLogs: function(namespace, name) {
        return $http.get(url.get('/namespaces/'+namespace+'/pods/'+name+'/log'),
          { transformResponse: function(d, h) {return { lines: d.split("\n") } } } // return raw response
        ).then(unwrap);
      }
    };
  }]);