# Vollständige Screen-Liste:

## 1. Startbildschirm
Der zentrale Einstiegspunkt mit zwei Hauptoptionen: "Neue Geschichte erstellen" und "Meine Geschichten". Hier erfolgt auch Login/Registrierung falls noch nicht angemeldet.

## 2. Login-Screen
Anmeldeformular mit E-Mail und Passwort-Feldern, "Anmelden"-Button und Link zur Registrierung. Visuelles Feedback bei Fehlern.

## 3. Registrierungs-Screen
Registrierungsformular mit notwendigen Feldern (E-Mail, Passwort, etc.), "Registrieren"-Button und Link zum Login. Fehlerbehandlung inklusive.

## 4. Story-Setup (Seite 1)
Erste Seite des horizontalen Flows: Texteingabe für das Thema der Geschichte (z.B. "Warum regnet es?") und Auswahl zwischen "Realistische Erklärung" oder "Fantasiegeschichte".

## 5. Story-Konfiguration (Seite 2)
Zweite Seite des Erstellungs-Flows: Auswahl des visuellen Stils (4 vordefinierte Optionen wie Peppa Pig Style, Pixi-Buch Style) und der Geschichtenlänge (Kurz/Mittel/Lang mit 8/12/16 Seiten).

## 6. Continue Story Screen
Zusammenfassung der bisherigen Geschichte mit Option "Weitererzählen". Leitet dann in den normalen Erstellungs-Flow über, aber mit Kontext der vorherigen Story.

## 7. Generierungs-Ansicht
Lade-Bildschirm mit ansprechender Animation oder Visualisierung, der die Wartezeit während der KI-Generierung überbrückt.

## 8. Lese-Ansicht
Die immersive, ablenkungsfreie Vollbild-Darstellung der generierten Geschichte mit ganzseitigen Bildern und eingebranntem Text. Navigation nur durch Wisch-Gesten, minimale Progress-Dots.

## 9. End-of-Story Screen
Abschluss-Seite nach dem Lesen mit den Aktionsoptionen: "Erneut lesen", "Neue Geschichte", "Geschichte weitererzählen" und "Speichern".

## 10. Meine Geschichten (Bibliothek)
Übersichtsseite aller gespeicherten Geschichten des Nutzers mit Vorschaubildern. Klick öffnet direkt die Lese-Ansicht. Kontext-Menü für Aktionen (Teilen, Export, Löschen).

## 11. Minimales Nutzerprofil
Einfacher Screen mit Nutzer-Email, "Passwort ändern"-Option und "Abmelden"-Button. Erreichbar über Settings-Icon.

## 12. Geteilte Geschichte (Public View)
Öffentliche Lese-Ansicht für geteilte Geschichten, die ohne Login zugänglich ist. Ähnlich der normalen Lese-Ansicht aber ohne Speicher-/Export-Optionen.

## 13. Error/Offline Screen
Fehlerbehandlung für Netzwerkprobleme, gescheiterte KI-Generierung oder andere technische Probleme. Mit Retry-Optionen wo sinnvoll.

**Plus Overlays/Toasts:** Share-Bestätigung, Offline-Status-Änderungen, Erfolgs-/Fehlermeldungen.