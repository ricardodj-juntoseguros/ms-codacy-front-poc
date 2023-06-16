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
  exit 0
fi

function deploy_cf_qas () {
  DNS_NAME=$(aws cloudfront list-distributions --output text --query "DistributionList.Items[].{Origins: Origins.Items[0].DomainName, Id: Id, Aliases: Aliases.Items[0]}|[?Aliases!=\`null\`]|[?Aliases==\`${APP}-qas-${SQUAD}.juntoseguros.com\`]" | awk '{print $1}')
  AWS_CF_ID_QAS=$(aws cloudfront list-distributions --output text --query "DistributionList.Items[].{Origins: Origins.Items[0].DomainName, Id: Id, Aliases: Aliases.Items[0]}|[?Aliases!=\`null\`]|[?Aliases==\`${APP}-qas-${SQUAD}.juntoseguros.com\`]" | awk '{print $2}')
  S3_PATH=$(aws cloudfront list-distributions --output text --query "DistributionList.Items[].{Origins: Origins.Items[0].DomainName, Id: Id, Aliases: Aliases.Items[0]}|[?Aliases!=\`null\`]|[?Aliases==\`${APP}-qas-${SQUAD}.juntoseguros.com\`]" | awk '{print $3}' | cut -d'.' -f1)

    CI="false"
    if [ $(echo $CIRCLE_BRANCH | grep -i "squad2") ]; then
    echo "Setting env AWS_CF and AWS_S3 to QAS_2"
    CF_ID=$AWS_CF_QAS_2
    AWS_S3=$AWS_S3_QAS_2
    elif [ $(echo $CIRCLE_BRANCH | grep -i "squad1") ]; then
    echo "Setting env AWS_CF and AWS_S3 to QAS_1"
    CF_ID=$AWS_CF_QAS_1
    AWS_S3=$AWS_S3_QAS_1
    elif [ $(echo $CIRCLE_BRANCH | grep -i "squad5") ]; then
    echo "Setting env AWS_CF and AWS_S3 to QAS_5"
    CF_ID=$AWS_CF_QAS_5
    AWS_S3=$AWS_S3_QAS_5
    elif [ $(echo $CIRCLE_BRANCH | grep -i "squad6") ]; then
    echo "Setting env AWS_CF and AWS_S3 to QAS_6"
    CF_ID=$AWS_CF_QAS_6
    AWS_S3=$AWS_S3_QAS_6
    elif [ $(echo $CIRCLE_BRANCH | grep -i "squad7") ]; then
    echo "Setting env AWS_CF and AWS_S3 to QAS_7"
    CF_ID=$AWS_CF_QAS_7
    AWS_S3=$AWS_S3_QAS_7
    fi


    cd ${PATH_APPS}/${i}
    aws s3 sync . s3://$AWS_S3/$APP --delete

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

function deploy_cf_stg () {
  DNS_NAME=$(aws cloudfront list-distributions --output text --query "DistributionList.Items[].{Origins: Origins.Items[0].DomainName, Id: Id, Aliases: Aliases.Items[0]}|[?Aliases!=\`null\`]|[?Aliases==\`${APP}-stg.juntoseguros.com\`]" | awk '{print $1}')
  AWS_CF_STG=$(aws cloudfront list-distributions --output text --query "DistributionList.Items[].{Origins: Origins.Items[0].DomainName, Id: Id, Aliases: Aliases.Items[0]} | [?Aliases!=\`null\`] | [?Aliases==\`${APP}-stg.juntoseguros.com\`]" | awk '{print $2}')
  AWS_S3_STG=$(aws cloudfront list-distributions --output text --query "DistributionList.Items[].{Origins: Origins.Items[0].DomainName, Id: Id, Aliases: Aliases.Items[0]}|[?Aliases!=\`null\`]|[?Aliases==\`${APP}-stg.juntoseguros.com\`]" | awk '{print $3}' | cut -d'.' -f1)

    CI="false"
    if [ $(echo $CIRCLE_BRANCH | grep -i "master") ]; then
    echo "Setting env AWS_CF and AWS_S3 to STG"
    CF_ID=$AWS_CF_STG
    AWS_S3=$AWS_S3_STG
    fi

    cd ${PATH_APPS}/${i}
    aws s3 sync . s3://$AWS_S3/$APP --delete

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

function deploy_cf_prd () {
  DNS_NAME=$(aws cloudfront list-distributions --output text --query "DistributionList.Items[].{Origins: Origins.Items[0].DomainName, Id: Id, Aliases: Aliases.Items[0]} | [?Aliases!=\`null\`] | [?Aliases==\`${APP}.juntoseguros.com\`]" | awk '{print $1}')
  AWS_CF_PRD=$(aws cloudfront list-distributions --output text --query "DistributionList.Items[].{Origins: Origins.Items[0].DomainName, Id: Id, Aliases: Aliases.Items[0]} | [?Aliases!=\`null\`] | [?Aliases==\`${APP}.juntoseguros.com\`]" | awk '{print $2}')
  AWS_S3_PRD=$(aws cloudfront list-distributions --output text --query "DistributionList.Items[].{Origins: Origins.Items[0].DomainName, Id: Id, Aliases: Aliases.Items[0]} | [?Aliases!=\`null\`] | [?Aliases==\`${APP}.juntoseguros.com\`]" | awk '{print $3}' | cut -d'.' -f1)

    CI="false"
    if [ $(echo $CIRCLE_BRANCH | grep -i "master") ]; then
    echo "Setting env AWS_CF and AWS_S3 to PRD"
    CF_ID=$AWS_CF_PRD
    AWS_S3=$AWS_S3_PRD
    fi

    cd ${PATH_APPS}/${i}
    aws s3 sync . s3://$AWS_S3/$APP --delete

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

        #APP="${i}"
        if [ "$i" == "plataforma" ]; then
        APP="corretor"
        elif [ "$i" == "vendors" ]; then
        APP="vendors"
        else
        APP="${i}"
        fi
        echo "Initing deploy app ${APP}..."
        if [ -n "${SQUAD}" ]; then
          echo "On envorinment squad${SQUAD}..."
        fi
        APP_DEPLOY="${APP}-qas-${SQUAD}.juntoseguros.com"
        deploy_cf_qas
    done
  else
    echo "Nothing changes identify to deploy!"
    echo "Please check your chances!"
    exit 1
  fi

  check_deploy
;;

staging)
  echo "Initing deploy on staging!"
  if [ ! -z "${LIST_APPS}" ]; then
    for i in ${LIST_APPS}
    do
        echo "Add preview"
        #APP="${i}"
        if [ "$i" == "plataforma" ]; then
        APP="corretor"
        elif [ "$i" == "vendors" ]; then
        APP="vendors"
        else
        APP="${i}"
        fi
        echo "Initing deploy app ${APP}..."
        APP_DEPLOY="${APP}-stg.juntoseguros.com"
        deploy_cf_stg
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
        #APP="${i}"
        if [ "$i" == "plataforma" ]; then
        APP="corretor"
        elif [ "$i" == "vendors" ]; then
        APP="vendors"
        else
        APP="${i}"
        fi
        echo "Initing deploy app ${APP}..."
        APP_DEPLOY="${APP}.juntoseguros.com"
        deploy_cf_prd
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
