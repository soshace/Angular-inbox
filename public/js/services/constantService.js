angular.module('InboxApp').constant('ConstantService', {
    clientId: '72592633798-rmmojkf41jhvhn767j6ol9bcqpu9m0hl.apps.googleusercontent.com',
    scopeList: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify'
    ],
    cookiePolicy: 'single_host_origin',
    signInButtonId: 'signInButton'
});
