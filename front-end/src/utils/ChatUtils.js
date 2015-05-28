/**
 * Created by evenoli on 27/05/2015.
 */
'use strict';

function Message(text) {
    return {
        body: text,
        author: "Dumbledore",
        timestamp: new Date()
    };
}

Message.prototype.getText = function () {
    return this.text;
};

module.exports = {
    Message: Message
};
