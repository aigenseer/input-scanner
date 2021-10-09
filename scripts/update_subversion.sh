#!/bin/bash
cp -rfv ./plugin/* ~/subversion/input-scanner/trunk/
cd ~/subversion/input-scanner/
svn add --force trunk/*
svn commit