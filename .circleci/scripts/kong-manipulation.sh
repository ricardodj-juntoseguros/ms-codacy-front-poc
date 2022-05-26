#!/usr/bin/env bash

# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

EXIT_TESTS=0
ENVIRONMENT="${1:-null}" # quality, staging, production
ACTION="${2:-null}"      # open, close
FILE_PATH="${3:-null}"   # ./integration-tests/spec/envs/env.qas.json
KUBECTL_BIN="https://storage.googleapis.com/kubernetes-release/release/v1.13.10/bin/linux/amd64/kubectl"
KOPS_BIN="https://github.com/kubernetes/kops/releases/download/v1.18.1/kops-linux-amd64"
KOPS_STATE_STORE="s3://kops-k8s-state-store-prd"
SERVICE_DEFINITION_FILE="ServiceDefinitions-k8s.json"
NAMESPACE_1="squad2"
SERVICE_1="ms-plataforma-bff"
SERVICE_2="fidelize-bff"

export ENVIRONMENT ACTION FILE_PATH KUBECTL_BIN KOPS_BIN KOPS_STATE_STORE

install_deps(){
    OS_VERSION=$(cat < /etc/os-release | grep PRETTY_NAME | sed "s/PRETTY_NAME=\"//"  | grep -Eo '^[^ ]+')
    if [ "${OS_VERSION}" != "Alpine" ];then
        echo "Installing dependencies..."
        apt-get update -qq
        apt-get install -y curl jq -qq
    elif [ "${OS_VERSION}" = "Alpine" ];then
        echo "Installing dependencies..."
        sudo apk add --no-cache curl jq &>/dev/null
    else
        echo "OS ${OS_VERSION} don't suported, please add dependencies to install on script."
        exit 1 
    fi

    # Install kubectl
    if [ ! -f "/usr/local/bin/kubectl" ]; then
        echo "Install kubectl"
        curl -Ls -o /tmp/kubectl "${KUBECTL_BIN}"
        sudo mv /tmp/kubectl /usr/local/bin/kubectl
        sudo chmod a+x /usr/local/bin/kubectl
        kubectl version --short --client
    fi

    # Install kops
    if [ ! -f "/usr/local/bin/kops" ]; then
        echo "Install kops"
        curl -Ls -o /tmp/kops "${KOPS_BIN}"
        sudo mv /tmp/kops /usr/local/bin/kops
        sudo chmod a+x /usr/local/bin/kops
        kops version
    fi
}

prepare_env(){

  if [ -f ${SERVICE_DEFINITION_FILE} ]; then
    echo "Prepare Environment variables to k8s"

    CIRCLECI_IP="$(wget -qO- http://checkip.amazonaws.com)/32"
    CLOUDFLARE_IPS=$(wget -qO- https://www.cloudflare.com/ips-v4)
    SERVICE_NAME=$(jq --raw-output '.global.service.service_name' < ${SERVICE_DEFINITION_FILE})
    INGRESS_CIDR_BLOCKS=$(jq --raw-output '.global.service.'"${ENVIRONMENT}"'.service.ingress_cidr_blocks' < ${SERVICE_DEFINITION_FILE})
    CLUSTER=$(jq --raw-output '.global.service.'"${ENVIRONMENT}"'.service.cluster' < ${SERVICE_DEFINITION_FILE})
    NAMESPACE=$(jq --raw-output '.global.service.'"${ENVIRONMENT}"'.service.namespace' < ${SERVICE_DEFINITION_FILE})

    NAMESPACE_SQUAD=$(echo "${CIRCLE_BRANCH}" | grep -i -o -E "squad[0-9]" | tr "[:upper:]" "[:lower:]" | head -n1) 2>&1 || EXIT_CODE=$?
    if [ -n "${NAMESPACE_SQUAD}" ]; then
        NAMESPACE="${NAMESPACE_SQUAD}"
    elif [ "${NAMESPACE}" == "null" ] || [ -z "${NAMESPACE}" ]; then
        NAMESPACE="default"
    fi

    INGRESS_CLASS=$(jq --raw-output '.global.service.'"${ENVIRONMENT}"'.service.ingress.class' < ${SERVICE_DEFINITION_FILE})

    if [ "$INGRESS_CLASS" == "kong" ]; then
        INGRESS_HOST=$(jq --raw-output '.global.service.'"${ENVIRONMENT}"'.service.ingress.host' < ${SERVICE_DEFINITION_FILE})
        INGRESS_CIDR_BLOCKS=$(jq --raw-output '.global.service.'"${ENVIRONMENT}"'.service.ingress.allowed_ips' < ${SERVICE_DEFINITION_FILE})
        if [ -n "$NAMESPACE_SQUAD" ]; then
            INGRESS_HOST_LEGACY="$INGRESS_HOST"
            NAMESPACE="$NAMESPACE_SQUAD"
            INGRESS_HOST=$(echo "$INGRESS_HOST" | sed -E 's/([^.]+)(\..*)/\1-'"$NAMESPACE_SQUAD"'\2/')
        fi
    fi

    export SERVICE_NAME INGRESS_CIDR_BLOCKS CLUSTER NAMESPACE INGRESS_HOST
  else
        CIRCLECI_IP="$(wget -qO- http://checkip.amazonaws.com)/32"
        CLOUDFLARE_IPS=$(wget -qO- https://www.cloudflare.com/ips-v4)
        CLUSTER="k8s-quality.juntoseguros.cloud"
        NAMESPACE="default"

        NAMESPACE_SQUAD=$(echo "${CIRCLE_BRANCH}" | grep -i -o -E "squad[0-9]" | tr "[:upper:]" "[:lower:]" | head -n1) 2>&1 || EXIT_CODE=$?
        if [ -n "${NAMESPACE_SQUAD}" ]; then
            NAMESPACE="${NAMESPACE_SQUAD}"
        elif [ "${NAMESPACE}" == "null" ] || [ -z "${NAMESPACE}" ]; then
            NAMESPACE="default"
        fi

        INGRESS_CLASS="kong"
        INGRESS_HOST="ms-gateway-${ENVIRONMENT}.juntoseguros.com"

        if [ -n "$NAMESPACE_SQUAD" ]; then
            INGRESS_HOST_LEGACY="$INGRESS_HOST"
            NAMESPACE="$NAMESPACE_SQUAD"
            INGRESS_HOST=$(echo "$INGRESS_HOST" | sed -E 's/([^.]+)(\..*)/\1-'"$NAMESPACE_SQUAD"'\2/')
        fi

        export SERVICE_NAME CLUSTER NAMESPACE INGRESS_HOST INGRESS_HOST_LEGACY

  fi
    # Get cluster kubeconfig
    EXIT_CODE=0
    kops get cluster --name "${CLUSTER}" 2>&1 || EXIT_CODE=$?
    if [ ! $EXIT_CODE -eq 0 ]; then
        echo "Invalid cluster name ${CLUSTER}"
    fi

    echo "Loading cluster configuration into kubectl"
    kops export kubecfg --name "${CLUSTER}"


    if [ "${FILE_PATH}" = "null" ]; then
        SERVICE_LIST=${CIRCLE_PROJECT_REPONAME}
        echo "SERVICE_LIST: $SERVICE_LIST"
    else
        ENV_FILE=$(find "${FILE_PATH}" | grep "${ENVIRONMENT}" )  2>&1 || EXIT_CODE=$?
        
        if [ -n "${ENV_FILE}" ]; then
        EXTENSION=$(echo "${ENV_FILE}" | sed 's/.*\.//')

            case "${EXTENSION}" in
                js)
                    SERVICE_LIST=$(cat ${ENV_FILE} | grep -i gateway |cut -d'"' -f4  | sed "s/https\:\/\/${INGRESS_HOST}\/\|https\:\/\/${INGRESS_HOST_LEGACY}\/$NAMESPACE_SQUAD\/\|https\:\/\/${INGRESS_HOST_LEGACY}\///g" | sed "s/\/.*//g")
                    SERVICE_LIST_HOST=$(cat ${ENV_FILE} | grep -i gateway |cut -d'"' -f4)
                ;;
               json)
                    SERVICE_LIST=$(cat ${ENV_FILE} | grep -i gateway |cut -d'/' -f5)
                    SERVICE_LIST_HOST=$(cat ${ENV_FILE} | grep -i gateway |cut -d'/' -f2-5 | sed 's/^\//https:\/\//')
                ;;
                *)
                    echo $"Please check if file is formated with json: $0"
                    exit 1
                ;;
            esac
            echo "-------------------------------------------"
            echo "SERVICE_LIST:"
            echo "$SERVICE_LIST"
            echo "-------------------------------------------"
            echo "SERVICE_LIST_HOST:"
            echo "$SERVICE_LIST_HOST"
            echo "-------------------------------------------"
        else
            echo "Please check if file with endpoints to ${1} environment exists on path '${FILE_PATH}'!"
        fi
    fi
}

open_kong(){
    echo "Opening CircleCI IP Address on Whitelist..."
        if [[ "$SERVICE_1" = "ms-plataforma-bff"  ]]; then
        
            PLUGIN=$(kubectl get kongplugin -n "${NAMESPACE_1}" "kong-ip-restriction-${SERVICE_1}" 2>&1 || EXIT_CODE=$?)

            echo "Adding CircleCI IP Address to Whitelist on Kong"
            kubectl patch kongplugin -n "${NAMESPACE_1}" "kong-ip-restriction-${SERVICE_1}" --type=json -p '[{"op": "add", "path": "/config/allow/-", "value": "'${CIRCLECI_IP}'"}]'
            kubectl patch kongplugin -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" --type=json -p '[{"op": "add", "path": "/config/allow/-", "value": "'${CIRCLECI_IP}'"}]'
            echo "Adding Cloudflare IPs Address to Whitelist on Kong"
            for SCLOUDFLARE_POINT in ${CLOUDFLARE_IPS}
            do
                kubectl patch kongplugin -n "${NAMESPACE_1}" "kong-ip-restriction-${SERVICE_1}" --type=json -p '[{"op": "add", "path": "/config/allow/-", "value": "'${SCLOUDFLARE_POINT}'"}]'
                kubectl patch kongplugin -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" --type=json -p '[{"op": "add", "path": "/config/allow/-", "value": "'${SCLOUDFLARE_POINT}'"}]'
            done

        elif [[ "$SERVICE_2" = "fidelize-bff"  ]]; then

            PLUGIN=$(kubectl get kongplugin -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" 2>&1 || EXIT_CODE=$?)

            echo "Adding CircleCI IP Address to Whitelist on Kong"
            kubectl patch kongplugin -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" --type=json -p '[{"op": "add", "path": "/config/allow/-", "value": "'${CIRCLECI_IP}'"}]'
            echo "Adding Cloudflare IPs Address to Whitelist on Kong"
            for SCLOUDFLARE_POINT in ${CLOUDFLARE_IPS}
            do
                kubectl patch kongplugin -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" --type=json -p '[{"op": "add", "path": "/config/allow/-", "value": "'${SCLOUDFLARE_POINT}'"}]'
            done
        else
            echo "Adding CircleCI IP Address to Whitelist on k8s"
            # WHITE_LIST="${INGRESS_CIDR_BLOCKS},${CICLECI_IP_ADDRESS}"
            # kubectl annotate ingress "${SERVICE}" -n "${NAMESPACE}" nginx.ingress.kubernetes.io/whitelist-source-range="${WHITE_LIST}" --overwrite
        fi

    sleep 30
}

close_kong(){    
    echo "Closing CircleCI IP Address on Whitelist..."

        echo "Recovering default whitelist on kong"
        if [[ "$SERVICE_1" = "ms-plataforma-bff"  ]]; then
            PLUGIN=$(kubectl get kongplugin -n "${NAMESPACE_1}" "kong-ip-restriction-${SERVICE_1}" 2>&1 || EXIT_CODE=$?)

            echo "Recovering default whitelist on kong"
            WHITE_LIST=$(kubectl get kongplugin -o json -n "${NAMESPACE_1}" "kong-ip-restriction-${SERVICE_1}" | jq .config.allow | jq 'del(.[] | select(. == "'${CIRCLECI_IP}'"))' | jq -c )
            WHITE_LIST2=$(kubectl get kongplugin -o json -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" | jq .config.allow | jq 'del(.[] | select(. == "'${CIRCLECI_IP}'"))' | jq -c )
            kubectl patch kongplugin -n "${NAMESPACE_1}" "kong-ip-restriction-${SERVICE_1}" --type=json -p '[{"op": "replace", "path": "/config/allow", "value":'${WHITE_LIST}'}]'
            kubectl patch kongplugin -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" --type=json -p '[{"op": "replace", "path": "/config/allow", "value":'${WHITE_LIST2}'}]'

            # kubectl patch kongplugin -n "${NAMESPACE_1}" "kong-ip-restriction-${SERVICE_1}" --type=json -p '[{"op": "remove", "path": "/config/allow/-", "value": "'${CIRCLECI_IP}'"}]'

            for SCLOUDFLARE_POINT in ${CLOUDFLARE_IPS}
            do
                WHITE_LIST=$(kubectl get kongplugin -o json -n "${NAMESPACE_1}" "kong-ip-restriction-${SERVICE_1}" | jq .config.allow | jq 'del(.[] | select(. == "'${SCLOUDFLARE_POINT}'"))' | jq -c )
                WHITE_LIST2=$(kubectl get kongplugin -o json -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" | jq .config.allow | jq 'del(.[] | select(. == "'${SCLOUDFLARE_POINT}'"))' | jq -c )
                kubectl patch kongplugin -n "${NAMESPACE_1}" "kong-ip-restriction-${SERVICE_1}" --type=json -p '[{"op": "replace", "path": "/config/allow", "value":'${WHITE_LIST}'}]'
                kubectl patch kongplugin -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" --type=json -p '[{"op": "replace", "path": "/config/allow", "value":'${WHITE_LIST2}'}]'

                # kubectl patch kongplugin -n "${NAMESPACE_1}" "kong-ip-restriction-${SERVICE_1}" --type=json -p '[{"op": "remove", "path": "/config/allow/-", "value": "'${SCLOUDFLARE_POINT}'"}]'

            done

        elif [[ "$SERVICE_2" = "fidelize-bff"  ]]; then

            PLUGIN=$(kubectl get kongplugin -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" 2>&1 || EXIT_CODE=$?)

            echo "Recovering default whitelist on kong"
            WHITE_LIST=$(kubectl get kongplugin -o json -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" | jq .config.allow | jq 'del(.[] | select(. == "'${CIRCLECI_IP}'"))' | jq -c )
            kubectl patch kongplugin -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" --type=json -p '[{"op": "replace", "path": "/config/allow", "value":'${WHITE_LIST}'}]'

            for SCLOUDFLARE_POINT in ${CLOUDFLARE_IPS}
            do
                WHITE_LIST=$(kubectl get kongplugin -o json -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" | jq .config.allow | jq 'del(.[] | select(. == "'${SCLOUDFLARE_POINT}'"))' | jq -c )
                kubectl patch kongplugin -n "${NAMESPACE}" "kong-ip-restriction-${SERVICE_2}" --type=json -p '[{"op": "replace", "path": "/config/allow", "value":'${WHITE_LIST}'}]'
            done

        else
            echo "Recovering default whitelist on k8s"
            # kubectl annotate ingress "${SERVICE}" -n "${NAMESPACE}" nginx.ingress.kubernetes.io/whitelist-source-range="${INGRESS_CIDR_BLOCKS}" --overwrite
        fi
}


case "${ENVIRONMENT}" in
    [Qq]uality)
        ENVIRONMENT="qas"
    ;;
    [Ss]taging)
        ENVIRONMENT="stg"
    ;;
    [Pp]roduction)
        ENVIRONMENT="prd"
    ;;
    *)
        echo $"Usage: $0 {quality|staging|production}"
        exit 1
    ;;
esac

case "${ACTION}" in
    [Oo]pen)
        install_deps $@
        prepare_env $@
        open_kong $@
    ;;
    [Cc]lose)
        install_deps $@
        prepare_env $@
        close_kong $@
    ;;
    *)
        echo $"Usage: $0 {Open|Close}"
        exit 1
    ;;
esac

echo "Done!"

exit "${EXIT_TESTS}"