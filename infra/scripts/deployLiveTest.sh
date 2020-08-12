#!/bin/bash
set -ex

npm install
npm install -g @angular/cli

if [ -z "$SITENAME_TEST" ]; then
    echo "There is no SITENAME_TEST"
else
    if [ "$CONFIG_FILE_SUFFIX" == "eu" ]; then
        export CONFIG_FILE_SUFFIX="eu-test"
        ng build --configuration=${CONFIG_FILE_SUFFIX}
        export CONFIG_FILE_SUFFIX="eu"
    elif [ "$CONFIG_FILE_SUFFIX" == "us1" ] || [ "$CONFIG_FILE_SUFFIX" == "hosted-us1" ]; then
        SUFFIX_AUX="$CONFIG_FILE_SUFFIX"
        export CONFIG_FILE_SUFFIX="eu-test"
        sed -i "s|https://eu-template3-portal-api-live.openchannel.io/|https://${SITENAME_TEST}/|g" src/environments/environment.eu-test.ts
        ng build --configuration=${CONFIG_FILE_SUFFIX}
        export CONFIG_FILE_SUFFIX="$SUFFIX_AUX"
    else
        ng build --configuration=${CONFIG_FILE_SUFFIX}
    fi

    export TEMPLATE3FRONTEND_STACKNAME="$CLUSTER_NAME-service-template3-portal-frontend-test"
    export TEMPLATE3FRONTEND_PROJECTNAME="template3-portal-frontend-test"
    # export TEMPLATE3FRONTEND_PROJECTNAME="$TEMPLATE3FRONTEND_STACKNAME"

    aws cloudformation deploy --region $REGION --stack-name ${TEMPLATE3FRONTEND_STACKNAME}-cloudfront --capabilities CAPABILITY_NAMED_IAM --no-fail-on-empty-changeset --template-file service-cloudfront.yml \
    --parameter-overrides HostedZoneName=$HOSTED_ZONE \
    CNAME=$SITENAME_TEST \
    CertificateArn=$CERTIFICATE_ARN \
    ClusterName=$CLUSTER_NAME \
    ProjectName=$TEMPLATE3FRONTEND_PROJECTNAME \
    TypeProj="TEST"
    export CF_DISTRIBUTION_ID_TEMPLATE3_FRONTEND=`aws ssm get-parameter --region $REGION --with-decryption --name /ECS-CLUSTER/$CLUSTER_NAME/template3-portal-frontend/DISTRIBUTION_ID_TEMPLATE3_FRONTEND_TEST --output text --query Parameter.Value`
    export AWS_S3_TEMPLATE3_FRONTEND="`aws ssm get-parameter --region $REGION --with-decryption --name /ECS-CLUSTER/$CLUSTER_NAME/template3-portal-frontend/AWS_S3_TEMPLATE3_FRONTEND_TEST --output text --query Parameter.Value`"
    mv dist/template3-portal-frontend dist/template3-portal-frontend || true
    aws s3 sync --delete dist/template3-portal-frontend/ s3://$AWS_S3_TEMPLATE3_FRONTEND
    aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION_ID_TEMPLATE3_FRONTEND --paths /index.html "/assets*"
    echo "$SITENAME_TEST"

    rm -rf dist/
fi

if [ -z "$SITENAME_LIVE" ]; then
    echo "There is no SITENAME_LIVE"
else
    if [ "$CONFIG_FILE_SUFFIX" == "eu" ]; then
        export CONFIG_FILE_SUFFIX="eu-live"
        ng build --configuration=${CONFIG_FILE_SUFFIX}
        export CONFIG_FILE_SUFFIX="eu"
    elif [ "$CONFIG_FILE_SUFFIX" == "us1" ] || [ "$CONFIG_FILE_SUFFIX" == "hosted-us1" ]; then
        SUFFIX_AUX="$CONFIG_FILE_SUFFIX"
        export CONFIG_FILE_SUFFIX="eu-live"
        sed -i "s|https://eu-template3-portal-api-live.openchannel.io/|https://${SITENAME_LIVE}/|g" src/environments/environment.eu-live.ts
        ng build --configuration=${CONFIG_FILE_SUFFIX}
        export CONFIG_FILE_SUFFIX="$SUFFIX_AUX"
    else
        ng build --configuration=${CONFIG_FILE_SUFFIX}
    fi

    export TEMPLATE3FRONTEND_STACKNAME="$CLUSTER_NAME-service-template3-portal-frontend-live"
    export TEMPLATE3FRONTEND_PROJECTNAME="template3-portal-frontend-live"
    # export TEMPLATE3FRONTEND_PROJECTNAME="$TEMPLATE3FRONTEND_STACKNAME"

    aws cloudformation deploy --region $REGION --stack-name ${TEMPLATE3FRONTEND_STACKNAME}-cloudfront --capabilities CAPABILITY_NAMED_IAM --no-fail-on-empty-changeset --template-file service-cloudfront.yml \
    --parameter-overrides HostedZoneName=$HOSTED_ZONE \
    CNAME=$SITENAME_LIVE \
    CertificateArn=$CERTIFICATE_ARN \
    ClusterName=$CLUSTER_NAME \
    ProjectName=$TEMPLATE3FRONTEND_PROJECTNAME \
    TypeProj="LIVE"
    export CF_DISTRIBUTION_ID_TEMPLATE3_FRONTEND=`aws ssm get-parameter --region $REGION --with-decryption --name /ECS-CLUSTER/$CLUSTER_NAME/template3-portal-frontend/DISTRIBUTION_ID_TEMPLATE3_FRONTEND_LIVE --output text --query Parameter.Value`
    export AWS_S3_TEMPLATE3_FRONTEND="`aws ssm get-parameter --region $REGION --with-decryption --name /ECS-CLUSTER/$CLUSTER_NAME/template3-portal-frontend/AWS_S3_TEMPLATE3_FRONTEND_LIVE --output text --query Parameter.Value`"
    mv dist/template3-portal-frontend dist/template3-portal-frontend || true
    aws s3 sync --delete dist/template3-portal-frontend/ s3://$AWS_S3_TEMPLATE3_FRONTEND
    aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION_ID_TEMPLATE3_FRONTEND --paths /index.html "/assets*"
    echo "$SITENAME_LIVE"
fi