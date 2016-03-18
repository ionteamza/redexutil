
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

if git remote -v | head -1 | grep '\shttps://github.com/ionteamza/redexutil.git\s'
then
  git remote set-url origin git@github.com:ionteamza/redexutil.git
  git remote -v
fi

git add -A
git commit -m "$message"
git push 
git status

git remote set-url origin https://github.com/ionteamza/redexutil.git
git remote -v 
