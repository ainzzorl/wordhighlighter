#!/usr/bin/env bash

# Borrowed from https://stackoverflow.com/a/46033999/8281118

previous_tag=0
for current_tag in $(git tag --sort=-creatordate)
do

if [ "$previous_tag" != 0 ];then
    tag_date=$(git log -1 --pretty=format:'%ad' --date=short ${previous_tag})
    printf "## ${previous_tag} (${tag_date})\n\n"
    git log ${current_tag}...${previous_tag} --pretty=format:'*  %s [View](https://github.com/ainzzorl/wordhighlighter/commit/%H)' --reverse | grep -v Merge
    printf "\n\n"
fi
previous_tag=${current_tag}
done