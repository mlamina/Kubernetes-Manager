'use strict';

angular.module('k8s-manager.dashboard', ['k8s-manager.api', 'ui.router'])

  .controller('DashboardController', function($scope, $state, $stateParams, namespaces) {
    $scope.namespaces = namespaces;
    $scope.currentNamespace = $stateParams.namespace || 'default';
    $scope.namespaceSelected = function(namespace) {
      debugger;
      $state.go('app.dashboard', {namespace: namespace});
    };
  });