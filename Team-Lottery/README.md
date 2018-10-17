(german for now. Sorry.)

# Gruppenlosung

## Anforderungen

Eingabe:

* Nimmt eine Namensliste als Input
* Nimmt optional kategorische Ausschlusskriterien (z.B. soundsoviele Männer/Frauen)
* Nimmt optional "alte" Gruppenlisten oder sonstige Ausschlusskriterien als Input

Ziele:

* Zufällige Gruppenzusammenstellung
* Diverse Gruppen
* Nachvollziehbare, deterministische Losung
* Zufallskomponente basiert auf externen Faktoren, z.B. einem echten Würfel oder Münzwurf.
* Personen, die bereits gemeinsam in Gruppen waren, werden nicht wieder zusammen gelost.

Bonuspunkte:

* Verarbeitung von Excel-Listen (input wie output)
* Gruppen in Nextcloud
* Erstellung von Pad-Templates
* Erstellung von Notenlisten
* wahlweise synchroner oder asynchroner Ablauf für entweder schnellen test _oder_ publikumswirksame Gameshow-Losung.


## Vorgehensweise

```
Namensliste -> Kandidatenliste -> Gruppenliste
```

* Einlesen der Namensliste
  -> jede Zeile ist ein Name
  -> jede Zeile wird mit .trim() bearbeitet um whitespace zu entfernen.

* Würfeln #1 für die Kandidatenliste ("Salt")
  -> Allen Namen der Namensliste wird die Zahl angehängt und sie werden gehasht

* nach dem Hashwert wird sortiert
  -> Sortierung ist von Würfelwurf abhängig
  -> nachvollziehbare aber zufällige Kandidatenliste
  -> Personen werden nicht bevorzugt, weil sie im Alphabet weit vorne stehen

* Würfeln #2 für die Schrittgröße
  -> Um so viele Stellen wird nach jedem Kandidaten weiter gezählt. Wird zB eine 2 gewürfelt, wird immer eine Person übersprungen.
  -> Ausnahme: wenn die Schrittgröße ein Vielfaches der Länge der Kandidatenliste ist, ergibt es keinen Sinn (weil in jedem Durchlauf die selbe Person dran wäre). In dem Fall wird ausnahmsweise einfach um _eine_ Person weiter gezählt.

* Auslosung
  -> Die Liste ist ausreichend zufällig, so dass dadurch kein Nachteil für die "hinteren" Plätze entsteht.
  -> Im Normalfall wird die aktuelle Person der aktuellen Gruppe zugeordnet. Danach geht es mit der nächsten Person und der nächsten Gruppe weiter.
  -> Bei Verteilung wird auf Ausschlusskriterien geachtet, Wenn die nächste Person in der Liste nicht "passt" wird sie übersprungen und die nächste Person der aktuellen Gruppe zugeordnet.

* Kann die Liste nicht vollständig abgearbeitet werden, wird einfach neu gewürfelt.
