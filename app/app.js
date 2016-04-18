'use strict';

// Declare app level module which depends on views, and components
angular.module('k8s-manager', [
    'ngMaterial',
    'ngAnimate',
    'ui.router',
    'angularMoment',
    'nvd3ChartDirectives',
    'k8s-manager.api',
    'k8s-manager.dashboard',
    'k8s-manager.toolbar',
    'k8s-manager.events',
    'k8s-manager.nodes',
    'k8s-manager.version',
    'k8s-manager.constants',
    'k8s-manager.about'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('orange');
    $urlRouterProvider.otherwise('/dashboard/default');
    $stateProvider
      .state('app', {
        url: '',
        templateUrl: 'components/toolbar/toolbar.html',
        controller: 'ToolbarController',
        resolve: {
          namespaces: function(Namespaces) {
            return Namespaces.queryAll();
          }
        }
      })
      .state('app.dashboard', {
        url: '/dashboard',
        templateUrl: 'components/dashboard/dashboard.html',
        controller: 'DashboardController'
      })
      .state('app.dashboard.namespace', {
        url: '/:namespace',
        resolve: {
          replicationControllers: function(ReplicationControllers, $stateParams) {
            return ReplicationControllers.byNamespace($stateParams.namespace);
          },
          services: function(Services, $stateParams) {
            return Services.byNamespace($stateParams.namespace);
          },
          pods: function(Pods, $stateParams) {
            return Pods.byNamespace($stateParams.namespace);
          }
        },
        views: {
          pods: {
            templateUrl: 'components/dashboard/pods/overview.html',
            controller: 'PodsResourceController'
          },
          rcs: {
            templateUrl: 'components/dashboard/replicationcontrollers/overview.html',
            controller: 'RcResourceController'
          },
          services: {
            templateUrl: 'components/dashboard/services/overview.html',
            controller: 'ServiceResourceController'
          }
        }
      })
      //.state('app.dashboard.pods.details', {
      //  url: '/:name',
      //  templateUrl: 'components/dashboard/pods/detail.html',
      //  controller: 'PodsDetailController',
      //  resolve: {
      //    pod: function (Pods, $stateParams) {
      //      return Pods.getPod($stateParams.namespace, $stateParams.name);
      //    }
      //  }
      //})
      //.state('app.dashboard.replicationcontrollers.details', {
      //  url: '/:name',
      //  templateUrl: 'components/dashboard/replicationcontrollers/detail.html',
      //  controller: 'RcDetailController',
      //  resolve: {
      //    replicationController: function($stateParams) {
      //      return ReplicationControllers.getRc($stateParams.namespace, $stateParams.name);
      //    }
      //  }
      //})
      .state('app.events', {
        url: '/events',
        templateUrl: 'components/events/events.html',
        controller: 'EventsCtrl',
        resolve: {
          events: function(Events) {
            return Events.queryAll();
          }
        }
      })
      .state('app.nodes', {
        url: '/nodes',
        abstract: true,
        templateUrl: 'components/nodes/viewport.html'
      })
      .state('app.nodes.all', {
        url: '/all',
        templateUrl: 'components/nodes/nodes.html',
        controller: 'NodesCtrl',
        resolve: {
          nodes: function(Nodes) {
            return Nodes.queryAll();
          }
        }
      })
      .state('app.nodes.detail', {
        url: '/:name',
        templateUrl: 'components/nodes/node-detail.html',
        controller: 'NodeDetailCtrl',
        resolve: {
          containers: function(Nodes, $stateParams) {
            return Nodes.getContainers($stateParams.name);
          },
          details: function(Nodes, $stateParams) {
            return Nodes.getDetails($stateParams.name);
          }
        }
      })
      .state('app.about', {
        url: '/about',
        templateUrl: 'components/about/about.html',
        controller: 'AboutCtrl'
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
