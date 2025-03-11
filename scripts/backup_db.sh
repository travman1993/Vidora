#!/bin/bash
# Database backup script for Vidora

# Exit on errors
set -e

# Load environment variables
if [ "$ENVIRONMENT" == "production" ]; then
  source ../config/prod.env
elif [ "$ENVIRONMENT" == "staging" ]; then
  source ../config/staging.env
else
  source ../config/dev.env
  ENVIRONMENT="development"
fi

# Create backup directory if it doesn't exist
BACKUP_DIR="../backups/database"
mkdir -p $BACKUP_DIR

# Set backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILENAME="vidora_${ENVIRONMENT}_db_${TIMESTAMP}.sql"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILENAME"

echo "===== Starting database backup ====="
echo "Environment: $ENVIRONMENT"
echo "Backup file: $BACKUP_FILENAME"

# PostgreSQL backup
if [ "$DB_TYPE" == "postgres" ]; then
  echo "Backing up PostgreSQL database..."
  PGPASSWORD=$DB_PASSWORD pg_dump \
    -h $DB_HOST \
    -U $DB_USER \
    -d $DB_NAME \
    -F c \
    -b \
    -v \
    -f "$BACKUP_PATH.gz"
  
  echo "PostgreSQL backup completed"

# MySQL backup
elif [ "$DB_TYPE" == "mysql" ]; then
  echo "Backing up MySQL database..."
  mysqldump \
    -h $DB_HOST \
    -u $DB_USER \
    -p$DB_PASSWORD \
    $DB_NAME \
    --single-transaction \
    --quick \
    --lock-tables=false \
    | gzip > "$BACKUP_PATH.gz"
  
  echo "MySQL backup completed"

# SQLite backup
elif [ "$DB_TYPE" == "sqlite" ]; then
  echo "Backing up SQLite database..."
  sqlite3 $DB_PATH .dump | gzip > "$BACKUP_PATH.gz"
  
  echo "SQLite backup completed"

else
  echo "Unsupported database type: $DB_TYPE"
  exit 1
fi

# Upload backup to cloud storage
if [ "$ENVIRONMENT" == "production" ] || [ "$ENVIRONMENT" == "staging" ]; then
  echo "Uploading backup to cloud storage..."
  
  if [ -n "$GCS_BUCKET" ]; then
    # Upload to Google Cloud Storage
    gsutil cp "$BACKUP_PATH.gz" "gs://$GCS_BUCKET/database-backups/$BACKUP_FILENAME.gz"
    echo "Backup uploaded to Google Cloud Storage: gs://$GCS_BUCKET/database-backups/$BACKUP_FILENAME.gz"
  elif [ -n "$S3_BUCKET" ]; then
    # Upload to Amazon S3
    aws s3 cp "$BACKUP_PATH.gz" "s3://$S3_BUCKET/database-backups/$BACKUP_FILENAME.gz"
    echo "Backup uploaded to Amazon S3: s3://$S3_BUCKET/database-backups/$BACKUP_FILENAME.gz"
  else
    echo "No cloud storage bucket configured. Backup stored locally only."
  fi
  
  # Rotate local backups (keep last 5)
  echo "Rotating local backups..."
  cd $BACKUP_DIR
  ls -t *.gz | tail -n +6 | xargs -r rm
  echo "Local backup rotation completed"
fi

echo "===== Database backup completed successfully ====="
echo "Backup file: $BACKUP_PATH.gz"
echo "Backup size: $(du -h "$BACKUP_PATH.gz" | cut -f1)"
echo "Backup date: $(date)"