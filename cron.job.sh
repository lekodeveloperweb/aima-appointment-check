#! /bin/bash

# Run every hour
# 0 * * * * path/to/cron.job.sh
# Run every minute
# * * * * * path/to/cron.job.sh

curret_date=$(date +"%Y-%m-%d_%H-%M-%S")
filename="~/logs/cron_log_file-$curret_date.log"

echo "Starting cron job at $curret_date"
docker rm schedule --force && docker run --name schedule ldw.solutions/aima-appointment-check:latest > $filename
echo "Cron job finished at $(date +"%Y-%m-%d_%H-%M-%S")"
echo "Log file: $filename"