STAGE="$1"
if [[ "$STAGE" == "stage" ]]; then
   PROFILE="vertrax"
   EB_STAGE="customer-dashboard-stage"
elif [[ "$STAGE" == "prod" ]]; then
   PROFILE="vertrax"
   EB_STAGE="customer-dashboard-prod"
   export REACT_APP_AWS_REGION=us-east-1
   export REACT_APP_GQL_ENDPOINT=https://fwqgtwijkc.execute-api.us-east-1.amazonaws.com/prod/graphql
   export REACT_APP_USER_POOL_ID=us-east-1_8SpzjP9qB
   export REACT_APP_WEB_CLIENT_ID=2uneh2l47s5m549ibf807kiat8
else
  echo "Unknown stage: $STAGE"
  exit 1
fi
#yarn install
#export REACT_APP_VERSION=`git describe`
#export REACT_APP_ENV=production
rm -rf ./build
mkdir build
npm run build
cp -rp ../build/* build
#if [ -z "$(git status --porcelain)" ]; then 
  eb deploy "$EB_STAGE" --profile "$PROFILE" 
#else
#  echo "Can't deploy a dirty git repo.  Please commit"	
  # Uncommitted changes in tracked files
#fi
