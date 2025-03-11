#!/bin/bash
# Deployment script for Vidora

# Exit on errors
set -e

echo "===== Starting Vidora deployment ====="
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DEPLOY_LOG="deploy_$TIMESTAMP.log"

# Load environment variables
if [ "$ENVIRONMENT" == "production" ]; then
  echo "Loading production environment..."
  source ../config/prod.env
elif [ "$ENVIRONMENT" == "staging" ]; then
  echo "Loading staging environment..."
  source ../config/staging.env
else
  echo "Loading development environment..."
  source ../config/dev.env
  ENVIRONMENT="development"
fi

echo "Deploying to $ENVIRONMENT environment"
echo "Deployment started at $(date)" | tee -a $DEPLOY_LOG

# Build frontend
echo "===== Building frontend =====" | tee -a $DEPLOY_LOG
cd ../
npm install
npm run build

# Run tests
echo "===== Running tests =====" | tee -a $DEPLOY_LOG
npm test

# Build backend (if using Python)
echo "===== Building backend =====" | tee -a $DEPLOY_LOG
cd backend
pip install -r requirements.txt

# Create database backup
echo "===== Creating database backup =====" | tee -a $DEPLOY_LOG
./backup_db.sh

# Deploy frontend to Vercel
echo "===== Deploying frontend to Vercel =====" | tee -a $DEPLOY_LOG
cd ../
if [ "$ENVIRONMENT" == "production" ]; then
  npx vercel --prod
else
  npx vercel
fi

# Deploy backend to Google Cloud
echo "===== Deploying backend to Google Cloud =====" | tee -a $DEPLOY_LOG
cd backend
if [ "$ENVIRONMENT" == "production" ]; then
  gcloud app deploy app.yaml --project=$GCP_PROJECT_ID
elif [ "$ENVIRONMENT" == "staging" ]; then
  gcloud app deploy staging.yaml --project=$GCP_PROJECT_ID
else
  echo "Skipping backend deployment for development environment" | tee -a $DEPLOY_LOG
fi

# Run database migrations
echo "===== Running database migrations =====" | tee -a $DEPLOY_LOG
python migrate.py

# Clear cache
echo "===== Clearing cache =====" | tee -a $DEPLOY_LOG
curl -X POST "$CACHE_PURGE_URL" -H "Authorization: Bearer $CACHE_PURGE_TOKEN"

# Send deployment notification
echo "===== Sending deployment notifications =====" | tee -a $DEPLOY_LOG
curl -X POST "$DEPLOYMENT_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{\"environment\": \"$ENVIRONMENT\", \"version\": \"$VERSION\", \"timestamp\": \"$TIMESTAMP\"}"

echo "===== Deployment completed successfully =====" | tee -a $DEPLOY_LOG
echo "Deployment finished at $(date)" | tee -a $DEPLOY_LOG