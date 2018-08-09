#!/bin/bash
set -e
REPO=appiriodevops
SERVICE=$1
ENV=$2
TAG_SUFFIX=$3
TAG="$ENV.$TAG_SUFFIX"

case $ENV in
  "DEV") S3_BUCKET="appirio-platform-dev";;
  "QA") S3_BUCKET="appirio-platform-qa";;
  "PROD") S3_BUCKET="appirio-platform-prod";;
esac

echo "Logging into docker"
echo "############################"
#docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASSWD
docker login -u $DOCKER_USER -p $DOCKER_PASSWD

echo "Building docker image"
echo "############################"
docker build -t $REPO/$SERVICE:$TAG .

echo "Pushing docker image"
echo "############################"
docker push $REPO/$SERVICE:$TAG


echo "Deploying to Elasticbeanstalk"
echo "############################"
sed -i='' "s/%TAG%/$TAG/;s/%S3_BUCKET%/$S3_BUCKET/" .deploy/Dockerrun.aws.json

export AWS_ACCESS_KEY_ID=$(eval "echo \$${ENV}_AWS_ACCESS_KEY_ID")
export AWS_SECRET_ACCESS_KEY=$(eval "echo \$${ENV}_AWS_SECRET_ACCESS_KEY")

# eb deploy
cd .deploy
eb init -r us-east-1 $SERVICE
EB_OUTPUT="$(eb deploy -l $TAG -r us-east-1)"
echo $EB_OUTPUT
if [[ $EB_OUTPUT =~ .*ERROR.* ]]
then
 exit 1
fi
exit 0
