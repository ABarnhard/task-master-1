#!/bin/bash

mongoimport --drop --db $1 --collection priorities --file ../../db/priorities.json
mongoimport --drop --db $1 --collection tasks --file ../../db/tasks.json

