#!/bin/bash

export ENV_PB_PRODUCTION=`aws ssm get-parameter --region ${REGION} --with-decryption --name /ECS-CLUSTER/${CLUSTER_NAME}/philips-market-frontend/ENV_PB_PRODUCTION --output text --query Parameter.Value`
export ENV_PB_APIURL="`aws ssm get-parameter --region ${REGION} --with-decryption --name /ECS-CLUSTER/${CLUSTER_NAME}/philips-market-frontend/ENV_PB_APIURL --output text --query Parameter.Value`"
export ENV_PB_CLIENT_ID=`aws ssm get-parameter --region ${REGION} --with-decryption --name /ECS-CLUSTER/${CLUSTER_NAME}/philips-market-frontend/ENV_PB_CLIENT_ID --output text --query Parameter.Value`
export ENV_PB_CLIENT_SECRET=`aws ssm get-parameter --region ${REGION} --with-decryption --name /ECS-CLUSTER/${CLUSTER_NAME}/philips-market-frontend/ENV_PB_CLIENT_SECRET --output text --query Parameter.Value`

sed -i "s|ENV_PB_PRODUCTION|$ENV_PB_PRODUCTION|g" environment.prod.ts
sed -i "s|ENV_PB_APIURL|$ENV_PB_APIURL|g" environment.prod.ts
sed -i "s|ENV_PB_CLIENT_ID|$ENV_PB_CLIENT_ID|g" environment.prod.ts
sed -i "s|ENV_PB_CLIENT_SECRET|$ENV_PB_CLIENT_SECRET|g" environment.prod.ts


cp environment.prod.ts src/environments/environment.prod.ts