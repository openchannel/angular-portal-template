#!/usr/bin/env sh

JIRA_EMAIL=$1
JIRA_API_KEY=$2
JIRA_FIX_VERSION=$3
NPM_REPOSITORY_VERSION=$4
NPM_LIBS_VERSION=$5
GIT_REPOSITORY_NAME='template3-portal-frontend'

isAmendCommit=false

# ==== Get latest changes
git pull

# ==== To project directory ===
cd ../..
projectDirectory=$(pwd);

# ==== Up main repository version ====
function upPackageJsonVersion() {
  # $1 - it is path to library
  cd $1 && npm version ${NPM_REPOSITORY_VERSION}
  if [ $? != 1 ]; then
    echo "${result} Up package.json version to ${NPM_REPOSITORY_VERSION} (path: $1)"
    else echo "${result} Can't update package.json version $1 ." && exit 1
  fi
}

## => (Optional) In main package.json (create a new commit with version)
if [ ! -z NPM_VERSION ];
  then
    echo "Up (repository) version to ${NPM_REPOSITORY_VERSION}"
    isAmendCommit=true
    upPackageJsonVersion "${projectDirectory}"
fi

# ==== (Optional) Up service and components dependencies version ====
if [ ! -z NPM_LIBS_VERSION ];
  then
    echo "Up (services & components) version to ${NPM_LIBS_VERSION}"
    npm i @openchannel/angular-common-services@${NPM_LIBS_VERSION}
    npm i @openchannel/angular-common-components@${NPM_LIBS_VERSION}
fi

npm i

# ==== changelog.md ====
## => Create changelog.md file
echo 'Creating a new changelog.md from JIRA issues.'
cd ${projectDirectory}/scripts/up-version
EMAIL=${JIRA_EMAIL} API_KEY=${JIRA_API_KEY} FIX_VERSION=${JIRA_FIX_VERSION} NPM_VERSION=${NPM_REPOSITORY_VERSION} GIT_REPOSITORY_NAME=${GIT_REPOSITORY_NAME} GIT_BRANCHES=\"$(git branch)\" node jira-changelog-builder.js

if [ $? == 1 ];
  then echo "Can't create changelog.md file" && exit 1
fi

# ==== Commit changes + create a tag + push changes
git add '../../package.json'
git add '../../package-lock.json'
git add '../../changelog.md'

if[ ${isAmendCommit} == true ];
  then git commit --amend -m "(Amend) Up version to ${NPM_REPOSITORY_VERSION}"
  else git commit -m "Up version to ${NPM_REPOSITORY_VERSION}"
fi

git push
