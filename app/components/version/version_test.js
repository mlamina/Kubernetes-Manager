'use strict';

describe('k8s-manager.version module', function() {
  beforeEach(module('k8s-manager.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
