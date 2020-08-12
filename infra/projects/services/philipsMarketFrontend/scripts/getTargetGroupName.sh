#!/bin/bash

IFS="." #delimiter
read -ra SITE <<< "$TEMPLATE3FRONTEND_SITENAME"
sitename="${SITE[0]}"

qtd=$(($(echo "$sitename" | wc -c)-1))

if [ "$qtd" -le 17 ]
then
    echo "$sitename"
else
    echo "${sitename:0:17}"
fi