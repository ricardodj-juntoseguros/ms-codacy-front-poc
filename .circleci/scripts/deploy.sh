#!/usr/bin/env bash

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail
# CircleCI requirements 
apt-get update
apt-get install -y vim build-essential awscli python3-pip software-properties-common apt-transport-https jq 
pip3 install --upgrade awscli


PATH_APPS="${PATH_APPS-"${CIRCLE_WORKING_DIRECTORY}/dist/apps/"}"

if [ -d "${PATH_APPS}" ]; then
  LIST_APPS=$(ls "${PATH_APPS}")

  PATH_SQUAD=$(echo "${CIRCLE_BRANCH}" | grep -i -o -E "squad[0-9]" | tr "[:upper:]" "[:lower:]" | head -n1 | sed 's/squad//') 2>&1 || EXIT_CODE=$?
  if [ -n "${PATH_SQUAD}" ]; then
    SQUAD="-${PATH_SQUAD}"
  else
    SQUAD=""
  fi
else
  echo "Nothing changes identify to deploy!"
  echo "Please check your changes or check if exist app(s) on path ${PATH_APPS}!"
  exit 1
fi

function deploy_cf () {
  DNS_NAME=$(aws cloudfront list-distributions --output text --query "DistributionList.Items[].{Origins: Origins.Items[0].DomainName, Id: Id, Aliases: Aliases.Items[0]}|[?Aliases!=\`null\`]|[?Aliases==\`${APP_DEPLOY}\`]" | awk '{print $1}')
  #CF_ID=$(aws cloudfront list-distributions --output text --query "DistributionList.Items[].{Origins: Origins.Items[0].DomainName, Id: Id, Aliases: Aliases.Items[0]}|[?Aliases!=\`null\`]|[?Aliases==\`${APP_DEPLOY}\`]" | awk '{print $2}')
  S3_PATH=$(aws cloudfront list-distributions --output text --query "DistributionList.Items[].{Origins: Origins.Items[0].DomainName, Id: Id, Aliases: Aliases.Items[0]}|[?Aliases!=\`null\`]|[?Aliases==\`${APP_DEPLOY}\`]" | awk '{print $3}' | cut -d'.' -f1)

  # if [ -z "${DNS_NAME}" ] || [ -z "${CF_ID}" ] || [ -z "${S3_PATH}" ]; then
  #   echo "Don't identify CF or S3 to deploy and app dont deployed!"
  #   echo "Please check your configurations to app ${APP}..."
  #   LIST_FAILED="${APP} ${LIST_FAILED}"
  # else
  # echo "Identided CF and S3!"
  # echo "Initing deploy on app: ${APP}..."
  # LIST_DEPLOYED="${APP} ${LIST_DEPLOYED}"

    CI="false"
    if [ $(echo $CIRCLE_BRANCH | grep -i "squad2") ]; then
    echo "Setting env AWS_CF and AWS_S3 to QAS_2"
    CF_ID=E2ZUKESZIDZ18X
    AWS_S3_QAS=platform-web-qas
    elif [ $(echo $CIRCLE_BRANCH | grep -i "squad5") ]; then
    echo "Setting env AWS_CF and AWS_S3 to QAS_5"
    AWS_CF_QAS=$AWS_CF_QAS_5
    AWS_S3_QAS=$AWS_S3_QAS_5
    elif [ $(echo $CIRCLE_BRANCH | grep -i "squad6") ]; then
    echo "Setting env AWS_CF and AWS_S3 to QAS_6"
    AWS_CF_QAS=$AWS_CF_QAS_6
    AWS_S3_QAS=$AWS_S3_QAS_6
    elif [ $(echo $CIRCLE_BRANCH | grep -i "squad7") ]; then
    echo "Setting env AWS_CF and AWS_S3 to QAS_7"
    AWS_CF_QAS=$AWS_CF_QAS_7
    AWS_S3_QAS=$AWS_S3_QAS_7
    fi


    cd ${PATH_APPS}/${i}
    aws s3 sync . s3://$AWS_S3_QAS/$APP --delete
    
    echo "Creating invalidations in CloudFront"
    aws configure set preview.cloudfront true
    aws cloudfront create-invalidation --distribution-id ${CF_ID} --paths "/*"
    echo "Done"
    AWS_LIST_INVALIDATIONS=$(aws cloudfront list-invalidations --distribution-id ${CF_ID} | jq '.InvalidationList | .Items | .[] | select(.Status != "Completed") | .Id' | cut -d \" -f2)
    if [ -z "${AWS_LIST_INVALIDATIONS}" ]; then
      echo No CloudFront Invalidations In Progress.
      exit 0
    else
      while IFS= read -r INVALIDATION_ID
      do
        echo Invalidation ID: ${INVALIDATION_ID}
        INVALIDATION_STATUS=$(aws cloudfront get-invalidation --distribution-id ${CF_ID} --id ${INVALIDATION_ID} 2>&1 | jq '.Invalidation | .Status' | cut -d \" -f2)
        while [ ${INVALIDATION_STATUS} = "InProgress" ]; do
          echo "Invalidation Status:" ${INVALIDATION_STATUS}
          echo "Waiting for invalidation to complete..."
          sleep 15
          INVALIDATION_STATUS=$(aws cloudfront get-invalidation --distribution-id ${CF_ID} --id ${INVALIDATION_ID} 2>&1 | jq '.Invalidation | .Status' | cut -d \" -f2)
        done
        echo "CloudFront Invalidation ${INVALIDATION_ID} ${INVALIDATION_STATUS}"
        done <<< "${AWS_LIST_INVALIDATIONS}"
      fi
}

function check_deploy () {
  if [ -n "${LIST_DEPLOYED}" ]; then
    echo "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
    echo "Identified deploy(s)!"
    echo "App(s) deployed: $LIST_DEPLOYED"
  fi

  if [ -n "${LIST_FAILED}" ]; then
    echo "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
    echo "Identified deploy(s) failed!"
    echo "Please check the app(s): $LIST_FAILED"
    echo "Exiting executation..."
    exit 1
  fi
}

case "$1" in
quality)
  echo "Initing deploy on quality!"
  if [ ! -z "${LIST_APPS}" ]; then
    for i in ${LIST_APPS}
    do
        #APP="${i}-preview"
        APP="${i}"
        echo "Initing deploy app ${APP}..."
        if [ -n "${SQUAD}" ]; then
          echo "On envorinment squad${SQUAD}..."
        fi
        APP_DEPLOY="${APP}2-qas-2.juntoseguros.com"
        deploy_cf
    done
  else
    echo "Nothing changes identify to deploy!"
    echo "Please check your chances!"
    exit 1
  fi
  
  check_deploy
;;

staging)
  echo "Initing deploy on quality!"
  if [ ! -z "${LIST_APPS}" ]; then
    for i in ${LIST_APPS}
    do
        echo "Add preview"
        #APP="${i}-preview"
        APP="${i}"
        echo "Initing deploy app ${APP}..."
        APP_DEPLOY="${APP}2-stg.juntoseguros.com"
        deploy_cf
    done
  else
    echo "Nothing changes identify to deploy!"
    echo "Please check your chances!"
    exit 1
  fi
  
  check_deploy
;;

production)
  echo "Initing deploy on quality!"
  if [ ! -z "${LIST_APPS}" ]; then
    for i in ${LIST_APPS}
    do
        echo "Add preview"
        #APP="${i}-preview"
        APP="${i}"
        echo "Initing deploy app ${APP}..."
        APP_DEPLOY="${APP}2.juntoseguros.com"
        deploy_cf
    done
  else
    echo "Nothing changes identify to deploy!"
    echo "Please check your chances!"
    exit 1
  fi
  
  check_deploy
;;

*) echo "Invalid Options. Try: quality, staging or production"

;;

esac