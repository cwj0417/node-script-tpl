#!/usr/bin/env node
import { program } from 'commander';
import { migrateComponent } from './component';
import { migrateProject } from './project';

program.command('component').action(migrateComponent);
program.command('project').action(migrateProject);

program.parse(process.argv);
