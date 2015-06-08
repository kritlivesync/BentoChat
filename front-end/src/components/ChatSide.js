'use strict';

import React from 'react';
import ChatActions from '../actions/messageAction';
import GroupStore from '../stores/GroupStore';



require('styles/ChatSide.sass');

class UserStatus extends React.Component {
    render () {
        var user = this.props.user;

        return (
            <div className="user-status">
                <div className="name">
                    {user.fullName}
                </div>
                <div className="username">
                    {user.username}
                </div>
                <div className="status">
                    {user.status || 'offline'}
                </div>
            </div>
        );
    }
}

export default class ChatSide extends React.Component {
    constructor() {
        this.state = {
            groupName: 'test-group',
            users: []
        };
    }

    getState () {
        return {
            users: GroupStore.getGroup(this.state.groupName) || []
        };
    }

    componentDidMount () {
        GroupStore.addChangeListener(this._onChange.bind(this));
        ChatActions.fetchGroups();
    }

    componentWillUnmount() {
        GroupStore.removeChangeListener(this._onChange.bind(this));
    }

    _onChange () {
        this.setState(this.getState());
    }

    render () {
        var users = this.state.users,
            userWidgets = users.map((user) => {
            return <UserStatus user={user} key={user.email} />;
        });

        return (
            <div className="user-container">
                {userWidgets}
            </div>
        );
    }
}