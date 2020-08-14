#!/bin/bash

ACCESS_KEY_ID=$1
SECRET_ACCESS_KEY=$2
REGION=${3:-"us-west-2"}
OUTPUT=${4:-"json"}
CREDENTIALS_LOCATION=${5:-"/root/.aws"}

if [ -z "$ACCESS_KEY_ID" ]
then
    echo "A ACCESS_KEY_ID must be passed as the first argument"
    exit 1
elif [ -z "$SECRET_ACCESS_KEY" ]
then
    echo "A SECRET_ACCESS_KEY must be passed as the second argument"
    exit 1
fi

mkdir -p $CREDENTIALS_LOCATION

echo "[default]" > $CREDENTIALS_LOCATION/config
echo "region = ${REGION}" >> $CREDENTIALS_LOCATION/config
echo "output = ${OUTPUT}" >> $CREDENTIALS_LOCATION/config
echo "[default]" > $CREDENTIALS_LOCATION/credentials
echo "aws_access_key_id = $ACCESS_KEY_ID" >> $CREDENTIALS_LOCATION/credentials
echo "aws_secret_access_key = $SECRET_ACCESS_KEY" >> $CREDENTIALS_LOCATION/credentials