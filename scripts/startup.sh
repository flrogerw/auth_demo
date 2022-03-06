#!/bin/bash

if [ "$TEST" = "test" ]; then
    echo "Running test suite..."
    npm run test
elif [ "$TEST" = "test-unit" ]; then
    echo "Running unit tests..."
    npm run test-unit
elif [ "$TEST" = "test-integration" ]; then
    echo "Running integration tests..."
    npm run test-integration
else
    if [ "$NODE_ENV" = "prod" ]; then
        echo "Running production service"
        npm run start
    else
        echo "Running development service"
        npm run dev
    fi
fi
