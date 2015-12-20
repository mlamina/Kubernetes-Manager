'use strict';

angular.module('k8s-manager.toolbar', ['ui.router'])

  .controller('ToolbarController', function($scope, $stateParams, namespaces, $state) {
    $scope.state = $state;
  });