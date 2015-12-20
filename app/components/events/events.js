'use strict';

angular.module('k8s-manager.events', ['k8s-manager.api'])

.controller('EventsCtrl', ['$scope', 'events', 'Events',
  function($scope, events, Modals, Events) {
    $scope.events = events;
    function reloadData() {
      Events.queryAll().then(function(events) {
        $scope.events = events;
      });
    }
    $scope.$on('auto-reload', reloadData);
  }]);