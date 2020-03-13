#!/bin/bash

if [[ $LAST_TIMESTAMP == "" ]]; then
        export LAST_TIMESTAMP="0"
fi
max=0
while read line; do
        if [[ $line > $max ]]; then
                max=$line
        fi
done <<<"$(hdfs dfs -ls all_tweets/ | rev | cut -d '_' -f 1 | cut -d '.' -f 2 | rev | sed -n '1!p')"

spark-submit --class fr.xebia.xke.SparkMetricsExample spark__tmtc_metrics-1.0-SNAPSHOT-shaded.jar

export LAST_TIMESTAMP="$max"
