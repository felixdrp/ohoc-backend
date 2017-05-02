#!/bin/bash

while IFS= read -r -d '' file; do
    # single filename is in $file
    
    if [ ! -d "$file" ]
    then
      echo "$file"
    fi



    # your code here
done < <(find . -name "*" -print0)
