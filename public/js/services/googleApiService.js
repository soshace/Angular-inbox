angular.module('InboxApp').service('googleApiService', ['ConstantService', function(constants) {
    Object.defineProperty(this, 'accessToken', {
        get: function() {
            return localStorage.getItem('gapiToken');
        },
        set: function(userId) {
            localStorage.setItem('gapiToken', userId);
        }
    });

    this.renderAuthButton = function(containerId, callback) {
        gapi.signin.render(containerId, {
            callback: callback,
            clientid: constants.clientId,
            scope: constants.scopeList.join(' '),
            cookiepolicy: constants.cookiePolicy
        });
    };

    this.checkAuth = function(callback) {
        gapi.auth.authorize({
            client_id: constants.clientId,
            immediate: true,
            scope: 'https://www.googleapis.com/auth/plus.login'
        }, function(auth) {
            callback(!!auth.access_token);
        });
    };

    this.getUserInfo = function(callback) {
        gapi.client.request({
            'path': '/plus/v1/people/me',
            'method': 'GET',
            'callback': callback
        });
    };

    this.getMessageList = function(callback) {
        var self = this;
        gapi.client.request({
            path: '/gmail/v1/users/me/messages?labelIds=INBOX&maxResults=100&key=' + self.accessToken,
            method: 'GET',
            callback: callback
        })
    };

    this.getMessage = function(messageId, callback) {
        var self = this;
        gapi.client.request({
            path: '/gmail/v1/users/me/messages/' + messageId + '?key=' + self.accessToken,
            method: 'GET',
            callback: function(message) {
                if (!message.error) {
                	var body = message.payload.parts ? message.payload.parts[0].body.data : message.payload.body.data;
                    callback({
                        body: body ? decodeURIComponent(escape(atob(body.replace(/-/g, '+').replace(/_/g, '/')))) : '',
                        subject: message.snippet
                    });
                } else {
                    callback({ error: true });
                }
            }
        })
    };
}]);
