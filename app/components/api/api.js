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
      },
      getRc: function(namespace, name) {
        return $http.get(url.get('/namespaces/'+namespace+'/replicationcontrollers/'+name)).then(unwrap);
      },
      deleteRc: function(namespace, name) {
        return $http.delete(url.get('/namespaces/'+namespace+'/replicationcontrollers/'+name)).then(unwrap);
      },
    };
  }])
  .factory('Pods', ['$http', 'UrlResolver', function($http, url) {
    return {
      byNamespace: function(namespace) {
        return $http.get(url.get('/namespaces/'+namespace+'/pods'))
          .then(unwrapItems)
          .then(function(pods) {
            // Count ready containers
            angular.forEach(pods, function(pod) {
              if (pod.status.containerStatuses) {
                var readyContainers = pod.status.containerStatuses.filter(function(stat) { return stat.ready });
                pod.containersReady = readyContainers.length;
              } else
                pod.containersReady = 0;

            });
            return pods;
        });
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
  }])
  .factory('Nodes', ['$http', 'UrlResolver', function($http, url) {

    return {
      queryAll: function() {
        return $http.get(url.get('/nodes')).then(unwrapItems);
      },
      getDetails: function(name) {
        return $http.get(url.get('/proxy/nodes/'+name+':4194/api/v1.0/machine')).then(unwrap);
      },
      getContainers: function(name) {
        return $http.get(url.get('/proxy/nodes/'+name+':4194/api/v1.0/containers')).then(unwrap);
      },
    };
  }]);