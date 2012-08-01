var vows = require('vows');
var assert = require('assert');
var jsonb = require('index');


vows.describe('jsonb').addBatch({
  
  'module': {
    'should export module function': function () {
      assert.isFunction(jsonb);
    },
    'should export compile and render function': function () {
      assert.isFunction(jsonb.compile);
      assert.isFunction(jsonb.render);
    },
    'should support express': function () {
      assert.isFunction(jsonb.__express);
      assert.strictEqual(jsonb.__express, jsonb);
    },
  },
  
  'render file': {
    topic: function(redirect) {
      var self = this;
      var options = { name: 'world' };
      jsonb(__dirname + '/fixtures/hello.jsonb', options, function(err, res) {
        self.callback(err, res);
      });
    },
    
    'should not error' : function(err, res) {
      assert.isNull(err);
    },
    'should render correctly' : function(err, res) {
      assert.equal(res, '{"hello":"world"}');
    },
  },
  
  'render file prettily': {
    topic: function(redirect) {
      var self = this;
      var options = { name: 'world', pretty: true };
      jsonb(__dirname + '/fixtures/hello.jsonb', options, function(err, res) {
        self.callback(err, res);
      });
    },
    
    'should not error' : function(err, res) {
      assert.isNull(err);
    },
    'should render correctly' : function(err, res) {
      assert.equal(res, '{\n  "hello": "world"\n}');
    },
  },
  
  'render file with spaces': {
    topic: function(redirect) {
      var self = this;
      var options = { name: 'world', spaces: 4 };
      jsonb(__dirname + '/fixtures/hello.jsonb', options, function(err, res) {
        self.callback(err, res);
      });
    },
    
    'should not error' : function(err, res) {
      assert.isNull(err);
    },
    'should render correctly' : function(err, res) {
      assert.equal(res, '{\n    "hello": "world"\n}');
    },
  },
  
  'render file with object option': {
    topic: function(redirect) {
      var self = this;
      var options = { object: 'json' };
      jsonb(__dirname + '/fixtures/json.jsonb', options, function(err, res) {
        self.callback(err, res);
      });
    },
    
    'should not error' : function(err, res) {
      assert.isNull(err);
    },
    'should render correctly' : function(err, res) {
      assert.equal(res, '{"foo":"bar"}');
    },
  },
  
  'render file with self option': {
    topic: function(redirect) {
      var self = this;
      var options = { name: 'world', self: true };
      jsonb(__dirname + '/fixtures/hello-self.jsonb', options, function(err, res) {
        self.callback(err, res);
      });
    },
    
    'should not error' : function(err, res) {
      assert.isNull(err);
    },
    'should render correctly' : function(err, res) {
      assert.equal(res, '{"hello":"world"}');
    },
  },
  
  'render file without locals': {
    topic: function(redirect) {
      var self = this;
      jsonb(__dirname + '/fixtures/static.jsonb', function(err, res) {
        self.callback(err, res);
      });
    },
    
    'should not error' : function(err, res) {
      assert.isNull(err);
    },
    'should render correctly' : function(err, res) {
      assert.equal(res, '{"beep":"boop"}');
    },
  },
  
  'useful stack traces': {
    topic: function(redirect) {
      var self = this;
      
      var str = [
        "obj.hello = name" // Failing line 
      ].join("\n");
      
      jsonb.render(str, function(err, res) {
        self.callback(err, res);
      });
    },
    
    'should error' : function(err, res) {
      assert.strictEqual(err.name, 'ReferenceError');
      assert.include(err.message, 'name is not defined');
      assert.include(err.message, 'jsonb:');
    },
  },
  
  'non useful stack traces': {
    topic: function(redirect) {
      var self = this;
      var options = { compileDebug: false };
      
      var str = [
        "obj.hello = name" // Failing line 
      ].join("\n");
      
      jsonb.render(str, options, function(err, res) {
        self.callback(err, res);
      });
    },
    
    'should error' : function(err, res) {
      assert.strictEqual(err.name, 'ReferenceError');
      assert.include(err.message, 'name is not defined');
      assert.equal(err.message.indexOf('jsonb:'), -1);
    },
  },
  
}).export(module);
