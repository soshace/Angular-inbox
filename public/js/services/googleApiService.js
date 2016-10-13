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
        var self = this;
        gapi.auth.authorize({
            client_id: constants.clientId,
            immediate: true,
            scope: 'https://www.googleapis.com/auth/plus.login'
        }, function(auth) {
            callback(auth.access_token);
        });
    };

    this.getUserInfo = function(callback) {
        gapi.client.request({
            'path': '/plus/v1/people/me',
            'method': 'GET',
            'callback': callback
        });
    };

    this.getMessageList = function(pageToken, callback) {
        var self = this;
        var pageTokenParam = pageToken ? '&pageToken=' + pageToken : '';
        gapi.client.request({
            path: '/gmail/v1/users/me/messages?labelIds=INBOX&labelIds=CATEGORY_UPDATES&maxResults=10&key=' + self.accessToken + pageTokenParam,
            method: 'GET',
            callback: callback
        })
    };

    this.getMessages = function(messageIds, callback) {
        var self = this;
        var batch = gapi.client.newBatch();
        var result = [];

        messageIds.map(messageId => batch.add(gapi.client.request({
            path: '/gmail/v1/users/me/messages/' + messageId + '?key=' + self.accessToken,
            method: 'GET'
        })));

        batch.then(function(batchResult) {
            for (var i in batchResult.result) {
                var message = batchResult.result[i].result;
                var body = message.payload.parts ? message.payload.parts[0].body.data : message.payload.body.data;
                result.push({
                    body: body ? decodeURIComponent(escape(atob(body.replace(/-/g, '+').replace(/_/g, '/')))) : '',
                    subject: message.payload.headers.filter(header => header.name === 'Subject').pop().value
                });
            }

            callback(result);
        });
    };
}]);
