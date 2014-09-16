angular.module('ngViewExample', ['ngRoute', 'ngAnimate'],
  function($routeProvider, $locationProvider) {
    $routeProvider.when('/playground/algorithm/', {
      templateUrl: 'row.html',
      controller: RowCntl,
      controllerAs: 'row'
    });

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
});

function RowCntl($scope) {

    $scope.settings = {};
    $scope.settings.distance="levenshtein";
    $scope.settings.type="without";

    $scope.settings.accordance = {
        firstname: 0.5,
        lastname: 0.5
    };

    $scope.settings.weight = {
        firstname: 1,
        lastname: 1
    };


    $scope.settings.tester = {
        firstname: 'Dominik',
        lastname: 'Müller',
    };

    $scope.color2 = function(matched) {
        return matched===0 ? 'yellow' : '';
    };

    $scope.color = function(row) {
        if(row.match === true) {
            return 'green';
        } else {
            return 'red';
        }
    }

    $scope.$watch('settings', function(val) {
        var calculated = [];

         var _calc = calc($scope, $scope.settings.tester, $scope.settings.tester)
         _calc['test'] = true;
         calculated.push(_calc);

        for(var i = 0, cnt = data.length; i < cnt; i++){
            var obj = data[i];
            var test = $scope.settings.tester;
            // echo "----------------------<br><br>";
            var _calc = calc($scope, test, obj);;
            calculated.push(_calc);
        }

        console.log(calculated);



       $scope.rows = calculated;
    }, true);


}


function _levenshtein(a, b, func) {
    if( 'function' === typeof func) {
        a = func(a);
        b = func(b);
    }
    var diff = levenshtein(a, b);
    var percent = (1-(diff/a.length));
    if(percent < 0) percent = 0;
    return percent;
}

function _jarowinkler(a, b, func) {
    if( 'function' === typeof func) {
        a = func(a);
        b = func(b);
    }
    var percent = jarowinkler(a, b);
    // console.log(a,b,percent);
    return percent;
}


var data = [
    {
        firstname: 'Dominik',
        lastname: 'Mueller',
    },
    {
        firstname: 'Dominic',
        lastname: 'Mueller',
    },
    {
        firstname: 'Dominic',
        lastname: 'Mülla',
    },
    {
        firstname: 'Dominik',
        lastname: 'Müller',
    },
    {
        firstname: 'Dominic',
        lastname: 'Muella',
    },
    {
        firstname: 'Dominik',
        lastname: 'Kukacka',
    },
    {
        firstname: 'Gessonita Patricia',
        lastname: 'De Morais Galizzi'
    },
    {
        firstname: 'Thomas',
        lastname: 'Müller-Lüdenscheidt'
    }
];

function calc($scope, tester, obj) {
    var ret = [],
        _weighted_accordance = 0;

    for(var k in obj){
        var value = obj[k];
        var test_value = tester[k];

        var tmp = {};

        var accordance_func = null;
        switch($scope.settings.distance) {
            case 'levenshtein':
                accordance_func = _levenshtein;
                break;
            case 'jarowinkler':
                accordance_func = _jarowinkler;
                break;
        }

        var diff_func = null;
        switch($scope.settings.type) {
            case 'without':
                diff_func = function(a){ return a; };
                break;
            case 'metaphone':
                diff_func = metaphone;
                break;
            case 'soundex':
                diff_func = soundex;
                break;
            case 'colophonetics':
                diff_func = colophonetics;
                break;
        }

        var _accordance = accordance_func(value,test_value, diff_func);

        // var _jarowinkler = colophonetics(value);
        // var _accordance_jarowinkler = func(value,test_value, jarowinkler);

        var _weight = $scope.settings.weight[k];

        tmp['value'] = value;
        tmp['type'] = k;
        tmp['accordance'] = _accordance;
        tmp['metaphone'] = metaphone(value);
        tmp['soundex'] = soundex(value);
        tmp['colophonetics'] = colophonetics(value);

        // tmp['jarowinkler'] = _jarowinkler;
        // tmp['jarowinkler_accordance'] = _accordance_jarowinkler;

        acc = $scope.settings.accordance[k];
        accordance_matched = false;

        // console.log($scope.settings.type, _value);

        if( _accordance >= acc ){
            accordance_matched = true;
        }

        tmp['accordance_matched'] = accordance_matched;
        ret.push(tmp);

        if(_weighted_accordance==0) {
            _weighted_accordance = _accordance * _weight
        } else {
            _weighted_accordance = (_weighted_accordance + (_accordance * _weight)) / 2;
        }
        // echo "$value == $test_value<br>";
        // echo "accordance: ". $accordance . " (".number_format($accordance,2) . " > $acc ) : ".($accordance_matched ? 'YES' : 'NO')."<br>";
    };

    var matched_count = 0;

    for( var i in ret ){
        if(ret[i]['accordance_matched'] === true) {
            matched_count += parseInt($scope.settings.weight[ret[i]['type']]);
        }
    }

    var matched = matched_count > ret.length / 2;




    return {
        match: matched,
        accordance: _weighted_accordance,
        properties: ret
    };
}




