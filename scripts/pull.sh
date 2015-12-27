
if [ -d util ]
then
  cd util
  pwd
fi

pwd | grep '\/util$' || exit 1

if [ $# -gt 0 ]
then
  message="$*"
else
  message="update"
fi

git pull
git status

