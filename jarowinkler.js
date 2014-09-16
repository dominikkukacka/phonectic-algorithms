var jaro = function(str1, str2){
  var lenStr1 = str1.length,
      lenStr2 = str2.length,
      matchWindow = Math.max(lenStr1, lenStr2)/2-1,
      transpositions=0,
      matches=0,
      letter='';

  // Test if swapping strX & lenStrX if stra is longer then str2 for proformance ??
  // another option is to bail out of the stepping once we are outside of the context of the other string
  // the issue is that with string lengths of 11 & 2 you wouldn't want to go through the loop 11 times

  /* find matches & transpositions */
  for (var i in str2) {
    letter = str2[i];
    if(str1.slice(i,i+matchWindow).indexOf(letter) > -1) { /* match */
      matches++;
    } else if(str1.slice(i-matchWindow,i).indexOf(letter) > -1) { /* transposition */
      matches++; transpositions++;
    }
  };
  return (1/3*(matches/lenStr1+matches/lenStr2+(matches-transpositions)/matches));
};

var jarowinkler = function(str1, str2, p){
  p = p || 0.1;
  var dj = jaro(str1,str2), l=0;

  for(var i=0; i<4; i++) { /* find length of prefix match (max 4) */
    if(str1[i]==str2[i]){ l++; } else { break; }
  }

  return dj+(l*p*(1-dj));
};


/*
var jarowinkler = function(string1,string2) {

    var ch, i, j, jaro, matchWindow, numMatches, prefix, string1Matches, string2Matches, transpositions, windowEnd, windowStart, _i, _j, _k, _l, _len, _len1, _len2, _ref;
    if (string1.length > string2.length) {
      _ref = [string2, string1], string1 = _ref[0], string2 = _ref[1];
    }
    matchWindow = Math.max(0, string2.length / 2 - 1);
    string1Matches = [];
    string2Matches = [];
    for (i = _i = 0, _len = string1.length; _i < _len; i = ++_i) {
      ch = string1[i];
      windowStart = Math.max(0, i - matchWindow);
      windowEnd = Math.min(i + matchWindow + 1, string2.length);
      for (j = _j = windowStart; windowStart <= windowEnd ? _j < windowEnd : _j > windowEnd; j = windowStart <= windowEnd ? ++_j : --_j) {
        if (!(string2Matches[j] != null) && ch === string2[j]) {
          string1Matches[i] = ch;
          string2Matches[j] = string2[j];
          break;
        }
      }
    }
    string1Matches = string1Matches.join("");
    string2Matches = string2Matches.join("");
    numMatches = string1Matches.length;
    if (!numMatches) {
      return 0;
    }
    transpositions = 0;
    for (i = _k = 0, _len1 = string1Matches.length; _k < _len1; i = ++_k) {
      ch = string1Matches[i];
      if (ch !== string2Matches[i]) {
        transpositions++;
      }
    }
    prefix = 0;
    for (i = _l = 0, _len2 = string1.length; _l < _len2; i = ++_l) {
      ch = string1[i];
      if (ch === string2[i]) {
        prefix++;
      } else {
        break;
      }
    }
    jaro = ((numMatches / string1.length) + (numMatches / string2.length) + (numMatches - ~~(transpositions / 2)) / numMatches) / 3.0;
    return jaro + Math.min(prefix, 4) * 0.1 * (1 - jaro);
};
*/
