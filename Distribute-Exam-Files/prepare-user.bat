set username="%1"

:: disable Drive D:
icacls D:\ /deny %username%:(OI)(CI)(R,W,D)

:: activate users Exam01/Exam02
net user /Active:Yes %username%

:: extract and change ownership
pushd "C:\Users\%username%\Desktop\"
mkdir "your name AVRD T1 Exam"
pushd "your name AVRD T1 Exam"
tar -xf "%HomeDrive%%HomePath%\Downloads\exam-template.zip"
icacls "." /setowner %username% /t /l
popd
popd
