:: bootstrap-script auf usb-stick
:: lädt batch von nextcloud
:: führt batch aus
:: 
:: - Hosts-Datei tauschen

echo Administrative permissions required. Detecting permissions...
pushd %~dp0

net session >nul 2>&1
if %errorLevel% == 0 (
	echo Success: Administrative permissions confirmed.
    copy exam-template.zip %HomeDrive%%HomePath%\Downloads\

    copy collect-Exam01.bat %HomeDrive%%HomePath%\Downloads\
    copy collect-Exam02.bat %HomeDrive%%HomePath%\Downloads\
    copy collect-username.bat %HomeDrive%%HomePath%\Downloads\

    copy prepare-computer.bat %HomeDrive%%HomePath%\Downloads\
    copy prepare-user.bat %HomeDrive%%HomePath%\Downloads\

    start cmd /c %HomeDrive%%HomePath%\Downloads\prepare-computer.bat
) else (
	echo Failure: Current permissions inadequate.
	pause
)
popd
