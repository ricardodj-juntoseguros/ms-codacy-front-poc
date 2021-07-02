#!/usr/bin/env bash

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

case "${1}" in
  quality)
    AWS_DEPLOYMENT_ROLE_ARN=${AWS_DEPLOYMENT_ROLE_ARN_QAS}
  ;;
  staging)
    AWS_DEPLOYMENT_ROLE_ARN=${AWS_DEPLOYMENT_ROLE_ARN_STG}
  ;;
  production)
    AWS_DEPLOYMENT_ROLE_ARN=${AWS_DEPLOYMENT_ROLE_ARN_PRD}
  ;;
  *)
    echo "Please use a valide parameter..."
    echo "Try: quality, staging or production"
    echo "Exiting executation..."
    exit 1
  ;;
esac

if [ -z "${AWS_DEPLOYMENT_ROLE_ARN}" ]; then
  echo "Don't role to assumption on ${1}!"
  echo "Please check ENV AWS_DEPLOYMENT_ROLE_ARN_XXX on CircleCI.."
  echo "Exiting executation..."
  exit 1
else
  TEMP_ROLE=$(aws sts assume-role --role-arn ${AWS_DEPLOYMENT_ROLE_ARN} --role-session-name "role_session_${1}" --duration-seconds 3600)
fi

if [ -z "${TEMP_ROLE}" ]; then
  echo "Don't identify CF or S3 to deploy and app dont deployed!"
  echo "Please check your configurations..."
  echo "Exiting executation..."
  exit 1
else
  echo "export AWS_ACCESS_KEY_ID=$(echo $TEMP_ROLE | jq .Credentials.AccessKeyId | xargs)" >> $BASH_ENV; source $BASH_ENV;
  echo "export AWS_SECRET_ACCESS_KEY=$(echo $TEMP_ROLE | jq .Credentials.SecretAccessKey | xargs)" >> $BASH_ENV; source $BASH_ENV;
  echo "export AWS_SESSION_TOKEN=$(echo $TEMP_ROLE | jq .Credentials.SessionToken | xargs)" >> $BASH_ENV; source $BASH_ENV;
fi