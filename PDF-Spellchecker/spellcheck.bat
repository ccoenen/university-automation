@echo off
SETLOCAL
echo Usage: run spellcheck.bat filename

:: needs
:: - hunspell (can be obtained via msys2)
:: - xpdf (more specifically: pdftotext)
:: - sort, grep, uniq, date (included in git, for example)

set DICPATH=C:\Users\amenthes\workspace\h_da Automatisierungs-Tools\PDF-Spellchecker\dictionaries
set DICTIONARIES=de_DE_frami,en_GB,en_US,imd-special-words
set HUNSPELL_EXE=C:\Tools\msys64\mingw32\bin\hunspell.exe
set PDFTOTEXT_EXE=C:\Tools\xpdfbin-win-3.04\bin64\pdftotext.exe
set SORT=C:\Program Files\Git\usr\bin\sort.exe
set DATE=C:\Program Files\Git\usr\bin\date.exe
set DESIRED_ENCODING="UTF-8"

set TEXT_FILE=%~1.utf-8.txt
set ADDITIONAL_DICTIONARY=%~dp1additional-dictionary.txt
set REPORT_FILE=%~1.report.md

:: inform the user about some of the paths we just set up.
echo working in %~dp1
echo - text file in %TEXT_FILE%
echo - additional dictionary file in %ADDITIONAL_DICTIONARY%
echo - report will be in in %REPORT_FILE%

::creates dictionary if it does not exist yet.
type nul >> "%ADDITIONAL_DICTIONARY%"

:: header of the report file we're writing to
echo # Document report > "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"
echo %~1 >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"
echo Generated on >> "%REPORT_FILE%"
"%DATE%" --iso-8601=second >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"

:: pdf to utf-8 text while also removing common ligatures
:: for teplacement list see https://superuser.com/a/220435/286021
"%PDFTOTEXT_EXE%" -enc "%DESIRED_ENCODING%" "%~1" - ^
  | sed ^
    -e 's/\\xEF\\xAC\\x80/ff/g' ^
    -e 's/\\xEF\\xAC\\x81/fi/g' ^
    -e 's/\\xEF\\xAC\\x82/fl/g' ^
    -e 's/\\xEF\\xAC\\x83/ffi/g' ^
    -e 's/\\xEF\\xAC\\x84/ffl/g' ^
    -e 's/\\xEF\\xAC\\x85/ft/g' ^
    -e 's/\\xEF\\xAC\\x86/st/g' ^
    > "%TEXT_FILE%"

echo ## Document Length >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"
wc "%TEXT_FILE%" >> "%REPORT_FILE%"

:: spell checking with a few twists:
:: - we're removing lines with more than three dots, these are from some TOCs
:: - no words with more than two dashes - usually url stuff.
:: - no words that end with a dash - usually hyphenation
echo. >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"
echo ## Hunspell Findings >> "%REPORT_FILE%"
echo. >> "%REPORT_FILE%"
"%HUNSPELL_EXE%" ^
  -d "%DICTIONARIES%" ^
  -p "%ADDITIONAL_DICTIONARY%" ^
  -l ^
  -i "%DESIRED_ENCODING%" ^
  "%TEXT_FILE%" ^
  | grep -v -e '\.\.\.' -e '[-.].\+[-.]' -e '-$' ^
  | "%SORT%" | uniq -c | "%SORT%" -rn ^
  >> "%REPORT_FILE%"

:: all good, report back
echo [7m%REPORT_FILE%[0m written.

:: opening the report in the default editor
"%REPORT_FILE%"

ENDLOCAL
