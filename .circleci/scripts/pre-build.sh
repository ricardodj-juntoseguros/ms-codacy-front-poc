#!/usr/bin/env bash

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

ENV_SQUAD=$(echo "$CIRCLE_BRANCH" | grep -i -o -E "squad[0-9]" | tr "[:upper:]" "[:lower:]" | head -n1 ) 2>&1 || EXIT_CODE=$?
APPS=$(ls -d apps/* | grep -v e2e)
DIR_APPS=apps

case "$1" in
quality)
echo "Initing pre-build on quality!"

if [ "$ENV_SQUAD" == "squad2" ]; then
	for DIR in $APPS 
    do 
    cp ./environments/.env.qa.$ENV_SQUAD .env 
    cp ${DIR_APPS}/${DIR##*/}/src/environments/.env.qa.$ENV_SQUAD ${DIR_APPS}/${DIR##*/}/.env
	done

 
elif [ "$ENV_SQUAD" == "squad5" ]; then
	for DIR in $APPS 
    do 
    cp ./environments/.env.qa.$ENV_SQUAD .env 
    cp ${DIR_APPS}/${DIR##*/}/src/environments/.env.qa.$ENV_SQUAD ${DIR_APPS}/${DIR##*/}/.env
	done


elif [ "$ENV_SQUAD" == "squad6" ]; then
	for DIR in $APPS 
    do 
    cp ./environments/.env.qa.$ENV_SQUAD .env 
    cp ${DIR_APPS}/${DIR##*/}/src/environments/.env.qa.$ENV_SQUAD ${DIR_APPS}/${DIR##*/}/.env
	done


elif [ "$ENV_SQUAD" == "squad7" ]; then
	for DIR in $APPS 
    do 
    cp ./environments/.env.qa.$ENV_SQUAD .env 
    cp ${DIR_APPS}/${DIR##*/}/src/environments/.env.qa.$ENV_SQUAD ${DIR_APPS}/${DIR##*/}/.env
	done
fi
;;

staging)
echo "Initing pre-build on staging!"

	for DIR in $APPS 
    do 
    cp ./environments/.env.staging .env && cp ${DIR_APPS}/${DIR##*/}/src/environments/.env.staging ${DIR_APPS}/${DIR##*/}/.env
	done
;;


production)
echo "Initing pre-build on production!"

	for DIR in $APPS 
    do 
    cp ./environments/.env.production .env && cp ${DIR_APPS}/${DIR##*/}/src/environments/.env.production ${DIR_APPS}/${DIR##*/}/.env
	done
;;

*) echo "Invalid Options. Try: quality, staging or production"

;;

esac