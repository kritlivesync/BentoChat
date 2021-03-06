/**
 * Created by sambudd on 28/05/2015.
 */
'use strict';

var React = require('react/addons'),
    TodoActions = require('../actions/todoActions'),
    TodoStore = require('../stores/TodoStore'),
    todoUtils = require('../utils/TodoUtils');


import GroupStore from '../stores/GroupStore';

var ENTER_KEY_CODE = 13;

var Assignee = React.createClass({
    render: function () {
        return (
            <label className="checkbox-inline">
                <input type="checkbox" value="">{this.props.data}</input>
                </label>
        );
    }
});

function getAssignee(assignee) {
    return (
        <Assignee data={assignee}/>
    );
}


var TodoForm =  React.createClass({

    getInitialState: function () {
        return (
        {
            text: '',
            author: '',
            title: '',
            due: ''
        }
        );
    },

    _onTextChange: function (event, value) {
        this.setState({text: event.target.value});
    },

    _onAuthorChange: function (event, value) {
        this.setState({author: event.target.value});
    },

    _onTitleChange: function(event, value) {
        this.setState({title: event.target.value});
    },

    _onDueChange: function(event, value) {
        this.setState({due: event.target.value});
    },

    _onKeyDown: function(e) {
        if (e.keyCode === ENTER_KEY_CODE) {
            this._onSubmit(e);
        }
    },

    _onSubmit: function(e) {
        e.preventDefault();
        var text = this.state.text.trim();
        var author = this.state.author.trim();
        var title = this.state.title.trim();
        var due = this.state.due;
        if (author && title) {
            var todo = new todoUtils.Todo(author, title, text, due);
            TodoActions.createTodo(todo);
            this.setState({text: ''});
            this.setState({author: ''});
            this.setState({title: ''});
            this.setState({due: ''});
        }
    },

    render: function() {
        //var GroupMembers = ["Sam", "Lorenzo", "Oli"];
        var GroupMembers = GroupStore.getGroup('test-group');
        //var GroupMemberListItems = GroupMembers.map(getAssignee);
        //console.log(GroupMemberListItems);

        return (
            <div className="todoc-body">
                <div className="todoc-form">
                    <div className="todo-author">
                        <input
                            className="form-control author-box"
                            name="author"
                            value={this.state.author}
                            onChange={this._onAuthorChange}
                            placeholder="Who's Task is it?"/>
                        <div className="btn-group">
                        <button className="btn btn-default word" disabled="disabled">
                            Due Date:
                        </button>
                        <input
                            className="btn btn-default picker"
                            type="date"
                            value={this.state.due}
                            onChange={this._onDueChange} />
                    </div>
                    </div>
                    <div className="todo-title">
                        <input
                            className="form-control title-box"
                            name="title"
                            value={this.state.title}
                            onChange={this._onTitleChange}
                            placeholder="Todo Title"/>

                    </div>
                    <div className="description-box">
                        <input
                            className="form-control desc-box"
                            name="text"
                            value={this.state.text}
                            onChange={this._onTextChange}
                            onKeyDown={this._onKeyDown}
                            placeholder="Todo Description (Optional)"/>
                    </div>
                </div>
                <div className="create-button">
                    <button onClick={this._onSubmit} className="btn btn-success btn-block" data-dismiss="modal">
                        <span className="glyphicon glyphicon-ok"></span>
                    </button>
                </div>
            </div>);
    }
});

module.exports = TodoForm;
