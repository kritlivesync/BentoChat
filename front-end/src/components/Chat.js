'use strict';

var React = require('react/addons'),
    MessageActions = require('actions/messageAction'),
    MessageStore = require('stores/ChatMessageStore'),
    ChatSide = require('../components/ChatSide'),
    ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

//Key code for 'enter' key
var ENTER_KEY_CODE = 13;

require('styles/Chat.sass');

var linkify = require('../utils/ChatUtils').linkify;

//Get the messages from the store
function getStateFromStores() {
    return {
        messages: MessageStore.getAll()
    };
}

var ChatTimestamp = React.createClass({
    render: function () {
        var d = new Date(this.props.timestamp);
        var mins = d.getMinutes();
        mins = mins > 9 ? mins : '0' + mins;
        var hours = d.getHours();
        hours = hours > 9 ? hours : '0' + hours;
        return (
                <div className="timestamp">
                    {hours}:{mins}
                </div>
            );
    }
});

var ChatAuthor = React.createClass({
    render: function () {
        return <div className="author">{this.props.name}</div>;
    }
});


//The visual representation of a message
var ChatMessage = React.createClass({
    render: function () {
        var msg = this.props.message;
        var linkedMsg = linkify(msg.body);
        return <div className="chat-row">
            <ChatTimestamp timestamp={msg.timestamp} />
            <ChatAuthor name={msg.author} />
            <div className="chat-text" dangerouslySetInnerHTML={{__html: linkedMsg}}></div>
        </div>;
    }
});

var ChatList = React.createClass({

    getInitialState: function() {
        return getStateFromStores();
    },

    // "componentDidMount: Invoked once, both on the client and server,
    // immediately before the initial rendering occurs. " - Thanks internet.
    // This ensures that whenever the store changes, we call -onChange, which
    // resets the state from the store.
    componentDidMount: function() {
        MessageStore.addChangeListener(this._onChange);
        MessageActions.fetchMessages();
    },

    componentWillUnmount: function() {
        MessageStore.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {
            var node = this.getDOMNode();
            node.scrollTop = node.scrollHeight;
    },

    render: function () {
        var messageElems = this.state.messages.map((msg) => {
            return ( <ChatMessage key={msg.id} message={msg} /> );
        });

        return (
            <div className="chatlist">
                {messageElems}
            </div>
        );
    },

    _onChange: function() {
        this.setState(getStateFromStores());
    }
});

var promptArray = require('../constants/ChatVariables').placeholders;

function randomPrompt() {
    var rand = Math.floor(Math.random() * promptArray.length);
    return promptArray[rand];
}

var NewMessageBox = React.createClass({
    getInitialState: function () {
        return { text: '' };
    },

    render: function () {
        return (
            <div className="input-group message-box">
                <input
                    className="form-control text-box"
                    placeholder={randomPrompt()}
                    value={this.state.text}
                    onChange={this._onChange}
                    onKeyDown={this._onKeyDown} />
                <button onClick={this._onSubmit} className="btn btn-success input-group-addon send-btn">
                    <span className="glyphicon glyphicon-ok"></span>
                </button>
            </div>
        );
    },

    _onChange: function (event) {
        this.setState({text: event.target.value});
    },

    _onSubmit: function(event) {
        event.preventDefault();
        console.log('YO');
        this.send();
    },

    //Send via enter key
    _onKeyDown: function(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            this.send();
        }
    },

    send: function() {
        var text = this.state.text.trim();
        if (text) {
            //Here is where we create the action and send it to the dispatcher
            MessageActions.createMessage(text);
        }
        //Reset text box
        this.setState({text: ''});
    }
});

var ChatBar = React.createClass({
    render: function () {
        return (
            <div>
                <div className="new-thread">
                    <button type="button" className="btn btn-default btn-block new-button" data-toggle="modal" data-target="#myModal">
                    New Thread
                    </button>
                </div>
            </div>
        );
    }
});

var Chat = React.createClass({
    render: function() {
        return (
            <div className="chat-body">
                <div className="chat-content">
                    <ChatList />
                    <NewMessageBox />
                </div>
                <div className="chat-nav">
                    <ChatBar />
                </div>
                <div className="chat-side">
                    <ChatSide />
                </div>
            </div>
        );
    }
});

module.exports = Chat;
