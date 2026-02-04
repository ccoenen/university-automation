::SET templateurl=
:: download zip
::curl -o "%HomeDrive%%HomePath%\Downloads\exam-template.zip" "%templateurl%"
:: temporarily done via usb-stick instead.

pushd %~dp0
call prepare-user.bat Exam01
call prepare-user.bat Exam02
popd

pause

:: log out.
shutdown /l
