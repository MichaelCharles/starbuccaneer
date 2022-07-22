#!/usr/bin/env node
var program = require("commander");
var starbuccaneer = require("./");
var package = require("../package.json");

program.version(package.version);

starbuccaneer();
