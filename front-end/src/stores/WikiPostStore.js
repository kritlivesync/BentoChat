/**
 * Created by evenoli on 28/05/2015.
 */
'use strict';

var AppDispatcher = require('../dispatcher/WebappAppDispatcher'),
    ActionTypes = require('../constants/ActionConstants'),
    WikiUtils = require('../utils/WikiUtils'),
    EventEmitter = require('events').EventEmitter,
    assign = require('object-assign');

var CHANGE_EVENT = 'change';

var posts = [];

function addPost (post) {
    posts.unshift(post);
}

function removePost (postid) {
    for (var i in posts) {
        if (posts[i].id === postid) {
             posts.splice(i, 1);
            return;
        }
    }
}

var PostStore = assign({}, EventEmitter.prototype, {

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get: function(id) {
        for (var i in posts) {
            if (posts[i].id === id) {
                return posts[i];
            }
        }
        return null;
    },

    getAll: function() {
        return posts;
    }
});

PostStore.dispatchToken = AppDispatcher.register(function(action) {

    switch(action.type) {

        case ActionTypes.CREATE_POST:
            var post = action.post;
            addPost(post);
            PostStore.emitChange();
            break;

        case ActionTypes.FETCH_POSTS:
            posts = action.post_list;
            PostStore.emitChange();
            break;

        case ActionTypes.DELETE_POST:
            removePost(action.postid);
            PostStore.emitChange();
            break;

        case ActionTypes.UPDATE_POST:
            var newPost = action.post;
            removePost(newPost.id);
            addPost(newPost);
            PostStore.emitChange();
            break;
    }
});

module.exports = PostStore;
