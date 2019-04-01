:: see my snippets file for how to disable all users beforehand.
:: these scripts will re-enable users automatically.

set TIMECODE=2019-SS
set COURSE=P2
node index.js --rules "rules\P-Projekt.js" --list "import 2019SS_\dozierende-p2.csv" --list "import 2019SS_\studierende-p2.csv" --overwrite-passwords --create-users --move-directories --send-mails
set COURSE=P4
node index.js --rules "rules\P-Projekt.js" --list "import 2019SS_\dozierende-p4.csv" --list "import 2019SS_\studierende-p4.csv" --overwrite-passwords --create-users --move-directories --send-mails
set COURSE=P6
node index.js --rules "rules\P-Projekt.js" --list "import 2019SS_\dozierende-p6.csv" --list "import 2019SS_\studierende-p6.csv" --overwrite-passwords --create-users --move-directories --send-mails
set COURSE=P7
node index.js --rules "rules\bachelor.js" --list "import 2019SS_\semester-bachelor.csv" --overwrite-passwords --create-users --move-directories --send-mails
set GROUPNAME=Mitarbeiter
node index.js --rules "rules\groupadd.js" --list "import 2019SS_\mitarbeiter.csv" --create-users --send-mails
set GROUPNAME=Elective-Physical-Interaction-8
node index.js --rules "rules\groupadd.js" --list "import 2019SS_\elective-physical-interaction.csv" --create-users --send-mails
