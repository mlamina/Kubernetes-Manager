'use strict';

/**
 * Switch between mock data for development and real k8s API.
 */
angular.module('k8s-manager.api')

  .factory('UrlResolver', ['useDataMocks', function(useDataMocks) {
    var useMocks = useDataMocks;
    function url(path) {
      if (useMocks)
        return 'mocks' + path + '.json';
      else
        return '/api/v1' + path;
    }
    return {
      get: url
    };
  }]);