#!/bin/bash

echo -e "\033[0;32mDeploying new blog...\033[0m"

if ! git st | egrep "On branch source"
then
    git checkout source
fi

yarn build
git checkout gh-pages

echo -e "\033[0;32mDeleting old site...\033[0m"
rm -rf assets/ publications/

echo -e "\033[0;32mTransferring new contents...\033[0m"
mkdir assets publications
mv dist/index.html .
mv dist/_headers .
mv dist/styleguide.html .
mv dist/publications/* publications/.
mv dist/assets/* assets/.
rm -r dist

# first line of index.html is blank, which mucks up github pages, so must be
# removed:
sed -i '1d' index.html

echo -e "\033[0;32mUpdating git...\033[0m"
git add index.html _headers styleguide.html publications/* assets/*
git add -u
git st
git commit -am "New Site Build (`date`)"
git push origin main

echo -e "\033[0;32mChange back to source branch...\033[0m"
git checkout source
rm -rf assets/ publications/

echo -e "\033[0;32mDeploy complete.\033[0m"
