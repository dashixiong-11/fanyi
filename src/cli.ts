#!/usr/bin/env node
import * as commander from "commander";
import {translate} from "./main";

const program = new commander.Command()
program.version('0.0.2')
    .name('fy')
    .usage('<Word>')
    .arguments('<Word>')
    .action((word)=>{
        translate(word)
    })

program.parse(process.argv)