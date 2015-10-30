'use strict';

// Declare app level module which depends on views, and components
angular.module('k8s-manager', [
  'ngAnimate',
  'ui.bootstrap',
  'ui.router',
  'angularMoment',
  'k8s-manager.api',
  'k8s-manager.overview',
  'k8s-manager.events',
  'k8s-manager.nodes',
  'k8s-manager.version',
  'k8s-manager.constants'
])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/dashboard/default");
    $stateProvider
      .state('dashboard-base', {
        abstract: true,
        templateUrl: "components/dashboard/dashboard.html"
      })
      .state('dashboard', {
        parent: 'dashboard-base',
        url: "/dashboard/:namespace",
        resolve: {
          namespaceReplicationControllers: function(ReplicationControllers, $stateParams) {
            return ReplicationControllers.byNamespace($stateParams.namespace);
          },
          namespaces: function(Namespaces) {
            return Namespaces.queryAll();
          },
          quotas: function(ResourceQuotas) {
            return ResourceQuotas.queryAll();
          },
          namespacePods: function(Pods, $stateParams) {
            return Pods.byNamespace($stateParams.namespace);
          },
          namespaceServices: function(Services, $stateParams) {
            return Services.byNamespace($stateParams.namespace);
          }
        },
        views: {
          menu: {
            templateUrl: "components/dashboard/menu.html",
            controller: 'DashboardMenuCtrl'
          },
          rc: {
            templateUrl: "components/dashboard/rc.html",
            controller: 'RcResourceController'
          },
          pods: {
            templateUrl: "components/dashboard/pods.html",
            controller: 'PodsResourceController'
          },
          services: {
            templateUrl: "components/dashboard/services.html",
            controller: 'ServiceResourceController'
          }
        }
      })
      .state('events', {
        url: "/events",
        templateUrl: "components/events/events.html",
        controller: 'EventsCtrl',
        resolve: {
          events: function(Events) {
            return Events.queryAll();
          }
        }
      })
      .state('nodes', {
        url: "/nodes",
        abstract: true,
        templateUrl: "components/nodes/viewport.html"
      })
      .state('nodes.all', {
        url: "/gad",
        templateUrl: "components/nodes/nodes.html",
        controller: 'NodesCtrl',
        resolve: {
          nodes: function(Nodes) {
            return Nodes.queryAll();
          }
        }
      })
      .state('nodes.detail', {
        url: "/:name",
        templateUrl: "components/nodes/node-detail.html",
        controller: 'NodeDetailCtrl',
        resolve: {
          containers: function(Nodes, $stateParams) {
            return Nodes.getContainers($stateParams.name);
          },
          details: function(Nodes, $stateParams) {
            return Nodes.getDetails($stateParams.name);
          }
        }
      });

  }])
  .controller('AutoReloadController', ['$rootScope', '$scope', '$interval', function($rootScope, $scope, $interval) {
    $scope.autoReloadActivated = true;
    var autoReload;
    function setAutoReloadInterval() {
      if ($scope.autoReloadActivated) {
        autoReload = $interval(function(){
          $rootScope.$broadcast('auto-reload');
        }, 2000);
      } else
        $interval.cancel(autoReload);
    }
    $scope.toggleAutoReload = function() {
      $scope.autoReloadActivated = !$scope.autoReloadActivated;
      setAutoReloadInterval();
    };
    setAutoReloadInterval();
  }])
  .filter('bytes', function() {
    return function(bytes, precision) {
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
      if (typeof precision === 'undefined') precision = 1;
      var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
        number = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
  });
