/**
 * Created by Quentin on 20/07/14.
 */
'use strict';

angular.module('mean.system').
    factory('WebRTC', ['Global', 'mySocket', '$rootScope', '$window', '$sce', function (Global, mySocket, $rootScope, $window, $sce) {
        var self = this;
        var SIGNALING_SERVER = '/',
            defaultChannel = 'openhangouts-default';
//        var socket = null;
        var connection = new RTCMultiConnection(defaultChannel);
        var observerCallbacks = [];
        var notifyObservers = function(){
            angular.forEach(observerCallbacks, function(callback){
                callback();
            });
        };

        self.users = [];
        self.myuser = null;

        connection.session = {
            audio: true,
            video: true
        };

        //Clean : check if we need the id variable.
        connection.extra = {
            username: Global.user.username,
            fullname: Global.user.name,
            id: Global.user._id
        };

        connection.openSignalingChannel = function(config) {
            var channel = config.channel || defaultChannel;
            var sender = Global.user._id;
            // if no user id : redirect to login
            mySocket.emit('new-channel', {
                channel: channel,
                sender: sender
            });
            // verif channel ok
            var socket = io.connect(SIGNALING_SERVER + channel);
            console.log(socket);

            socket.channel = channel;
            console.log(socket);
            socket.on('connect', function() {
                console.log(socket);
                if (config.callback) config.callback(socket);
            });

            socket.switchPresenter = function(id) {
                if (connection.isInitiator())
                {
                    socket.emit('setPresenter', {
                        id: id
                    });
                }
            }
            socket.send = function(message) {
                socket.emit('message', {
                    sender: sender,
                    data: message
                });
            };
            socket.on('message', config.onmessage);
        };

        connection.onstream = function(e) {
            if (e.type === 'local') {
                var url = $window.URL.createObjectURL(e.stream);
                self.myuser = {'id' : e.extra.id, 'username' : e.extra.username, 'stream' : $sce.trustAsResourceUrl(url)};
            }

            if (e.type === 'remote') {
                var url = $window.URL.createObjectURL(e.stream);
                self.users.push({'id' : e.extra.id, 'username' : e.extra.username, 'stream' : $sce.trustAsResourceUrl(url)});
            }
            notifyObservers();
        };

        connection.onleave = function(userid, extra) {
            if (extra) console.log(extra.username + ' left you!');
            var video = document.getElementById(userid);
            if (video) video.parentNode.removeChild(video);
        };

        connection.connect();
        return {
            getUsers: function(){return self.users},
            getMyUser: function(){return self.myuser},
            connect: function() {
                connection.interval = 1000;
                connection.open();
            },
            switchPresenter: function(id){
            //    socketo.switchPresenter(id);
            },
            registerObserverCallback: function(callback){
                observerCallbacks.push(callback);
            }
        };
    }]);
