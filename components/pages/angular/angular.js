'use strict';

function LetterCtrl($scope) {
    $scope.welcome = "欢迎";
    console.log("yes");
}


module.exports = ['$scope', LetterCtrl]