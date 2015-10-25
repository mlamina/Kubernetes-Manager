'use strict';

angular.module('k8s-manager.events', ['ui.bootstrap', 'k8s-manager.api', 'k8s-manager.modals'])

.controller('EventsCtrl', ['$scope', 'events', 'Modals', 'Events',
  function($scope, events, Modals, Events) {
    $scope.events = events;
    function reloadData() {
      Events.queryAll().then(function(events) {
        $scope.events = events;
      });
    }
    $scope.$on('auto-reload', reloadData);
    $scope.openPodModal = Modals.openPodModal;
  }]);