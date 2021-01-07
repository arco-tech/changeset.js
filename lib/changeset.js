"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Changeset = void 0;
var Changeset = /** @class */ (function () {
    function Changeset(options) {
        this.originals = {};
        this.changes = {};
        this.fieldErrors = {};
        this.errorMessage = null;
        this.originals = options.originals || {};
        this.changes = options.changes || {};
        this.fieldErrors = options.fieldErrors || {};
    }
    Changeset.prototype.getValue = function (field) {
        if (this.changes.hasOwnProperty(field)) {
            return this.changes[field];
        }
        else {
            return this.originals[field];
        }
    };
    Changeset.prototype.getOriginals = function () {
        return __assign({}, this.originals);
    };
    Changeset.prototype.getOriginal = function (field) {
        return this.originals[field];
    };
    Changeset.prototype.setOriginal = function (field, value) {
        this.originals[field] = value;
    };
    Changeset.prototype.hasOriginal = function (field) {
        return this.originals.hasOwnProperty(field);
    };
    Changeset.prototype.getChanges = function () {
        return __assign({}, this.changes);
    };
    Changeset.prototype.getChange = function (field) {
        return this.changes[field];
    };
    Changeset.prototype.setChange = function (field, value) {
        this.changes[field] = value;
    };
    Changeset.prototype.hasChange = function (field) {
        return this.changes.hasOwnProperty(field);
    };
    Changeset.prototype.getAllFieldErrors = function () {
        return __assign({}, this.fieldErrors);
    };
    Changeset.prototype.getFieldErrors = function (field) {
        return this.fieldErrors[field];
    };
    Changeset.prototype.setFieldErrors = function (field, errors) {
        this.fieldErrors[field] = errors;
    };
    Changeset.prototype.setAllFieldErrors = function (errors) {
        this.fieldErrors = errors;
    };
    Changeset.prototype.hasFieldErrors = function (field) {
        return (Array.isArray(this.fieldErrors[field]) &&
            this.fieldErrors[field].length > 0);
    };
    Changeset.prototype.getErrorMessage = function () {
        return this.errorMessage;
    };
    Changeset.prototype.setErrorMessage = function (error) {
        this.errorMessage = error;
    };
    Changeset.prototype.hasErrorMessage = function () {
        return this.errorMessage != null;
    };
    Changeset.prototype.hasError = function () {
        if (this.hasErrorMessage()) {
            return true;
        }
        else {
            for (var field in this.fieldErrors) {
                if (this.hasFieldErrors(field)) {
                    return true;
                }
            }
        }
        return false;
    };
    return Changeset;
}());
exports.Changeset = Changeset;
