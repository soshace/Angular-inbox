angular.module('InboxApp').controller('inboxCtrl', ['$scope', 'googleApiService', 'ConstantService', function($scope, googleApi, constants) {
    function init() {
        googleApi.checkAuth(function(authToken) {
            if (!authToken) {
                googleApi.renderAuthButton(constants.signInButtonId, function() {
                    googleApi.checkAuth(function(authToken) {
                        if (authToken) {
                            googleApi.accessToken = authToken;
                            $scope.$apply(function() {
                                $scope.init = true;
                            });
                            initPersonalData();
                        }
                    });
                });
            } else {
                $scope.$apply(function() {
                    $scope.init = true;
                });
                initPersonalData();
            }
        });
    };

    function initPersonalData() {
        googleApi.getUserInfo(function(user) {
            $scope.$apply(function() {
                $scope.name = user.name;
                $scope.loadBunchOfMessages($scope.nextPageToken);
            });
        });
    }

    $scope.loadBunchOfMessages = function(nextPage) {
        googleApi.getMessageList(nextPage, function(result) {
            var list = result.messages;
            $scope.nextPageToken = result.nextPageToken;

            googleApi.getMessages(list.map(el => el.id), function(messages) {
                $scope.$apply(function() {
                    messages.map(message => $scope.messages.push(message));
                });
            })
        })
    };

    $scope.startInit = function() {
        init();
    };

    $scope.init = false;
    $scope.nextPageToken = '';
    $scope.messages = [];
}]);
