'use strict';

// Declare app level module which depends on views, and components
angular.module('k8s-manager', [
  'ngAnimate',
  'ui.bootstrap',
  'ui.router',
  'k8s-manager.api',
  'k8s-manager.overview',
  'k8s-manager.events',
  'k8s-manager.version',
  'k8s-manager.constants'
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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
      ;

}]);