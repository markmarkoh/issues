var Github = require('github');
var Backbone = require('backbone');
var _ = require('underscore');

/*
 * GET farm.
 */

exports.index = function(req, res){
  getAllTagsData('yeoman', 'yeoman');
  res.render('index', { title: 'Farm' });
};

var ApiRateLimiter = Backbone.Collection.extend({
  defaults: {
    threads: 5,
    queue: []
  },

  initialize: function() {
    this.on('add', function(data) {

    });
  }
});

function getAllTagsData(owner, repo) {
  'use strict';
  var git = new Github({version: '3.0.0'});
  var tags = new Backbone.Collection();
  var shas = new Backbone.Collection();

  tags.on('add', function(added) {
    git.gitdata
      .getReference(
        {
          user: owner,
          repo: repo,
          ref: 'tags/' + added.get('tagName')
        }, function(err, msg) {
          if (msg && msg.object && msg.object.sha) {
            shas.add({sha: msg.object.sha, tagName: added.get('tagName')});
            //console.log('tags on add', added.get('tagName'), msg.object.sha);
          }
      });
  });

  shas.on('add', function(added) {
    git.gitdata.getTag({
      user: owner,
      repo: repo,
      sha: added.get('sha')
    }, function(err, msg) {
      if (msg && msg.tagger) {
        console.log('$=', added.get('tagName'), msg.tagger.date);
      }
    });
  });

  git.repos
    .getTags(
      {
        user: owner,
        repo: repo
      }, function(err, results) {
        _.each(results, function(msg) {
          tags.add( {tagName: msg.name} );
        });
      });

}