var size = [];
var keypress = require('keypress');
size[0] = process.stdout.columns;
size[1] = process.stdout.rows;
var chalk = require('chalk');
var currVert = -1;
var currHoriz = 1;
var currPos = [0, 0];
var lPaddlePos = 0;
var rPaddlePos = 0;
var theTimer;
keypress(process.stdin);
var ballCol = 'white',
    isCol = process.argv[2] && process.argv[2] == 'col';
    //keys: w,s for left paddle, i,k for right!
process.stdin.on('keypress', function(ch, key) {
    if (key.name == 'i' || key.name == 'k' || key.name == 'w' || key.name == 's') {
        movePaddle(key.name);
    }
    if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
        clearInterval(theTimer);
    }
    if (key.name == 'q') {
        process.stdin.pause();
        clearInterval(theTimer);
    }
})
var movePaddle = function(n) {
    if (n == 's' && lPaddlePos < size[1]) {
        lPaddlePos++;
    } else if (n == 'w' && lPaddlePos > 0) {
        lPaddlePos--;
    } else if (n == 'k' && rPaddlePos < size[1] > 0) {
        rPaddlePos++;
    } else if (n == 'i' && rPaddlePos > 0) {
        rPaddlePos--;
    }
}
process.stdin.setRawMode(true);
process.stdin.resume();
var scores = [0, 0];
theTimer = setInterval(function() {
    //clear screen
    for (var c = 0;c<size[1];c++){
        var clearStr = isCol?chalk.bgGreen(' '.repeat(size[0]-1)):' '.repeat(size[0]-1);
        console.log(clearStr)
    }
    //rows before
    if (currPos[1] > 0) {
        for (var i = 0; i < currPos[1]; i++) {
            //is this a 'paddle' row?
            var rowStr = '';
            if (i == lPaddlePos || i - 1 == lPaddlePos || i + 1 == lPaddlePos) {
                rowStr = isCol ? chalk.bgGreen.red('#') : '#';
            } else {
                rowStr = isCol ? chalk.bgGreen(' ') : ' ';
            }
            if (!isCol) {
                if (i == rPaddlePos || i - 1 == rPaddlePos || i + 1 == rPaddlePos) {
                    rowStr += ' '.repeat(size[0] - 5) + '#';
                } else {
                    rowStr += ' '.repeat(size[0] - 4);
                }
            } else {
                if (i == rPaddlePos || i - 1 == rPaddlePos || i + 1 == rPaddlePos) {
                    rowStr += chalk.bgGreen(' '.repeat(size[0] - 5)) + chalk.bgGreen.blue('#');
                } else {
                    rowStr += chalk.bgGreen(' '.repeat(size[0] - 4));
                }
            }
            console.log(rowStr)
        }
    }
    var xSpacer;
    if (currPos[1] == lPaddlePos || currPos[1] + 1 == lPaddlePos || currPos[1] - 1 == lPaddlePos) {
        xSpacer = isCol?chalk.bgGreen.red('#'):'#';
        if (currPos[0] - 1 > 0) {
            xSpacer += isCol?chalk.bgGreen(' '.repeat(currPos[0] - 1)):' '.repeat(currPos[0] - 1);
        }
    } else {
        xSpacer = isCol?chalk.bgGreen(' '.repeat(currPos[0])):' '.repeat(currPos[0]);
    }
    var xAfterSpacer = '';
    if (currPos[1] == rPaddlePos || currPos[1] + 1 == rPaddlePos || currPos[1] - 1 == rPaddlePos) {
        xAfterSpacer += isCol?chalk.bgGreen(' '.repeat((size[0] - currPos[0]) - 5)) + chalk.bgGreen.blue('#'):' '.repeat((size[0] - currPos[0]) - 5) + '#';
    } else {
        xAfterSpacer += isCol?chalk.bgGreen(' '.repeat((size[0] - currPos[0]) - 4)):' '.repeat((size[0] - currPos[0]) - 4);
    }
    var theBall = isCol?chalk.bgGreen.black('O'):'O';
    console.log(xSpacer + theBall + xAfterSpacer)
        //draw rows after
        // + xAfterSpacer
    for (var i = 0; i < (size[1] - (currPos[1])) - 1; i++) {
        //is this a 'paddle' row?
        var rowStr = ''
        if (((i + 1) + currPos[1]) == lPaddlePos || ((i + 1) + currPos[1]) - 1 == lPaddlePos || ((i + 1) + currPos[1]) + 1 == lPaddlePos) {
            rowStr = isCol ? chalk.bgGreen.red('#') : '#';
        } else {
            rowStr = isCol ? chalk.bgGreen(' ') : ' ';;
        }
        if (!isCol) {
            if (((i + 1) + currPos[1]) == rPaddlePos || ((i + 1) + currPos[1]) - 1 == rPaddlePos || ((i + 1) + currPos[1]) + 1 == rPaddlePos) {
                rowStr += ' '.repeat(size[0] - 5) + '#';
            } else {
                rowStr += ' '.repeat(size[0] - 4);
            }
        } else {
            if (((i + 1) + currPos[1]) == rPaddlePos || ((i + 1) + currPos[1]) - 1 == rPaddlePos || ((i + 1) + currPos[1]) + 1 == rPaddlePos) {
                rowStr += chalk.bgGreen(' '.repeat(size[0] - 5)) + chalk.bgGreen.blue('#');
            } else {
                rowStr += chalk.bgGreen(' '.repeat(size[0] - 4));
            }
        }
        console.log(rowStr)
    }
    //score row
    console.log('Score:', scores[0], '|', scores[1])
    if (currPos[1] + currVert < 0 || currPos[1] + currVert > size[1] - 5) {
        currVert = -1 * currVert;
    }
    if (currPos[0] + currHoriz < 0 || currPos[0] + currHoriz > size[0] - 5) {
        currHoriz = -1 * currHoriz;
    }
    doBounce();
    currPos[0] += currHoriz;
    currPos[1] += currVert;
}, 40);
var doBounce = function() {
    if (currPos[0] < 2 && (lPaddlePos - currPos[1] > 1 || lPaddlePos - currPos[1] < -1) && currHoriz == -1) {
        currVert = -1;
        currHoriz = 1;
        scores[1]++;
        currPos = [0, 0];
    }
    if ((currPos[0] > size[0] - 7) && (rPaddlePos - currPos[1] > 1 || rPaddlePos - currPos[1] < -1) && currHoriz == 1) {
        currVert = -1;
        currHoriz = 1;
        scores[0]++;
        currPos = [0, 0];
    }
}
