#!/usr/bin/env node
import healthCheck from "./health-check.js";
import { program } from "commander";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import lib from "./lib.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
program
    .name("Starbuccaneer")
    .description("A utility to keep you connected to Starbucks Wifi at Starbucks in Japan.")
    .version(packageJson.version);
program.parse();
lib.log("Started...");
healthCheck();
