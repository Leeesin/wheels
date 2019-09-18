"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var INTEGER = 'INTEGER';
var PLUS = 'PLUS';
var EOF = 'EOF';
var Token = /** @class */ (function () {
    function Token(type, value) {
        var _this = this;
        this.toString = function () { return "Token(" + _this.type + ", " + _this.value + ")"; };
        this.type = type;
        this.value = value;
    }
    return Token;
}());
var Interpreter = /** @class */ (function () {
    function Interpreter(text) {
        var _this = this;
        this.pos = 0;
        this.currentToken = new Token(EOF, null);
        this.error = function () {
            throw Error('Error parsing input');
        };
        this.getNextToken = function () {
            var text = _this.text;
            if (_this.pos > text.length - 1) {
                return new Token(EOF, null);
            }
            var currentChar = text[_this.pos];
            if (/[0-9]/.test(currentChar)) {
                _this.pos++;
                return new Token(INTEGER, Number(currentChar));
            }
            else if (currentChar === '+') {
                _this.pos++;
                return new Token(PLUS, Number(currentChar));
            }
            else {
                return _this.error();
            }
        };
        this.eat = function (tokenType) {
            if (_this.currentToken.type === tokenType) {
                _this.currentToken = _this.getNextToken();
            }
            else {
                _this.error();
            }
        };
        this.expr = function () {
            _this.currentToken = _this.getNextToken();
            var left = _this.currentToken;
            _this.eat(INTEGER);
            var op = _this.currentToken;
            _this.eat(PLUS);
            var right = _this.currentToken;
            _this.eat(INTEGER);
            return left.value + right.value;
        };
        this.text = text;
    }
    return Interpreter;
}());
exports.Interpreter = Interpreter;
var res = new Token('', 1);
