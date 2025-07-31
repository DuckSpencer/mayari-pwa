# Finales Product Requirements Document (PRD) für "Mayari"

## Ziele und Hintergrundkontext

### Ziele

* **Die "Erklärungsnot" beenden:** Eltern ein Werkzeug an die Hand geben, mit dem sie sofort auf Kinderfragen reagieren und korrekte, aber kindgerechte Erklär-Geschichten generieren können.
* **Den "Content-Hunger" stillen:** Eine unendliche Quelle für kreative, personalisierte Fantasiegeschichten bieten, um die tägliche Vorlese-Routine frisch und spannend zu halten.
* **Ein reibungsloses Erlebnis schaffen:** Eine intuitive und einfache Bedienung sicherstellen, vom Erstellen der Geschichte bis zum immersiven Lese-Erlebnis ohne Ablenkungen.

### Hintergrundkontext

Die Kernidee ist die Entwicklung einer Progressive Web App (PWA) namens "Mayari", die personalisierte Kinderbücher mittels künstlicher Intelligenz generiert. Die Zielgruppe sind Eltern mit Kindern im Alter von 2 bis 5 Jahren. Die App adressiert zwei zentrale Herausforderungen, mit denen Eltern konfrontiert sind: die pädagogische Notwendigkeit, komplexe Fragen kindgerecht zu beantworten, und den ständigen Bedarf an neuen, unterhaltsamen Inhalten für die Vorlese-Routine.

## Anforderungen

### Funktional

* **FR1:** Die App muss es dem Nutzer ermöglichen, durch eine Texteingabe ein Thema für eine Geschichte vorzugeben (z.B. "Warum regnet es?").
* **FR2:** Nutzer müssen vor der Generierung zwischen zwei Story-Modi wählen können: "Realistische Erklärung" und "Fantasiegeschichte".
* **FR3:** Nutzer müssen einen von vier vordefinierten visuellen Stilen für die Illustrationen auswählen können (z.B. Peppa Pig Style, Pixi-Buch Style, etc.).
* **FR4:** Nutzer müssen eine von drei vordefinierten Längen für die Geschichte auswählen können (Kurz: 8 Seiten, Mittel: 12 Seiten, Lang: 16 Seiten).
* **FR5:** Die generierte Geschichte muss als eine Serie von ganzseitigen Bildern mit eingebranntem Text dargestellt werden.
* **FR6:** Die Navigation durch die Geschichte darf ausschließlich durch Wisch-Gesten (links/rechts) erfolgen, um das Gefühl des Umblätterns zu simulieren.
* **FR7:** Nach dem Lesen muss eine Funktion zum Speichern der Geschichte im persönlichen Bereich "Meine Geschichten" vorhanden sein.
* **FR8:** Es muss eine Funktion geben, um die gespeicherte Geschichte als PDF-Dokument zu exportieren.
* **FR9:** Die App muss eine Funktion zum Teilen der Geschichte anbieten.
* **FR10:** Das System muss eine Nutzer-Authentifizierung (Login/Registrierung) unterstützen, um persönliche Geschichtenbibliotheken und zukünftige Abo-Modelle zu ermöglichen.

### Nicht-Funktional

* **NFR1:** Die Anwendung muss als Progressive Web App (PWA) entwickelt werden, um eine App-ähnliche Erfahrung und Offline-Fähigkeiten zu gewährleisten.
* **NFR2:** Gespeicherte Geschichten müssen offline verfügbar sein.
* **NFR3:** Die Leseansicht der Geschichte muss frei von jeglichen ablenkenden UI-Steuerelementen sein; nur die Bilder und der Fortschrittsbalken (Mini-Progress-Dots) sind sichtbar.
* **NFR4:** Der in die Bilder integrierte Text muss eine große, gut lesbare Schriftart verwenden, die für Kinder im Alter von 2-5 Jahren geeignet ist.
* **NFR5:** Der Text pro Seite darf maximal 2-3 Sätze umfassen.
* **NFR6:** Die Implementierung muss dem definierten technischen Stack folgen (Next.js, Supabase, `claude-sonnet-4`, `gpt-image-1`, etc.).

## User Interface Design Goals

### Overall UX Vision
Die Benutzeroberfläche soll sich bewusst nicht wie eine komplexe App, sondern wie ein ruhiges, magisches Digital-Buch anfühlen. Der Fokus liegt auf einer immersiven, ablenkungsfreien Leseerfahrung, die die Kreativität anregt und die "Bildschirmzeit" in eine wertvolle "Vorlesezeit" verwandelt.

### Key Interaction Paradigms
* **Durchgängiger Horizontal-Flow:** Nach dem Verlassen des Startbildschirms bewegt sich der Nutzer fast ausschließlich in einem horizontalen "Swipe-Flow". Vertikales Scrollen wird vermieden.
* **Seitengestützte Erstellung:** Jeder Schritt der Geschichtenerstellung wird auf einer eigenen "Seite" präsentiert, durch die der Nutzer wischt.
* **Nahtloser Übergang & Loop-Design:** Der Prozess geht fließend vom Erstellen ins Lesen und wieder zurück zum Erstellen über, ohne dass der Nutzer den horizontalen Flow verlassen muss.
* **Diskreter Ausstieg:** Es muss eine unaufdringliche, aber klare Möglichkeit geben, um aus dem Flow zurück zum Startbildschirm zu gelangen.

### Core Screens and Views (im Horizontal-Flow)
* **Startbildschirm:** (Vertikale Ansicht) Bietet zwei klare Optionen: [Neue Geschichte erstellen] und [Meine Geschichten].
* **Erstellungs-Flow (2 Seiten):**
    1.  **Seite 1:** Eingabe des Themas & Auswahl des Story-Typs ("Realistische Erklärung" oder "Fantasiegeschichte").
    2.  **Seite 2:** Auswahl des visuellen Stils & der Länge. Startet die Generierung.
* **Generierungs-Ansicht:** Ein ansprechender Lade-Zustand oder eine Animation muss die Wartezeit überbrücken, während die Geschichte erstellt wird.
* **Lese-Flow:** Die Seiten der generierten Geschichte.
* **End-of-Story-Flow:** Eine Abschluss-Seite mit den Optionen [Erneut lesen], [Neue Geschichte] und [Geschichte weitererzählen].

### Accessibility
Es wird eine Konformität nach **WCAG 2.1 AA-Level** angestrebt.

### Branding
Das Branding wird primär durch die Illustrationsstile getragen. Die restliche UI bleibt minimalistisch, freundlich und vertrauenserweckend.

### Target Device and Platforms
Responsive Web (PWA) für moderne Browser auf Desktops, Tablets und Smartphones.

## Technische Annahmen

### Repository-Struktur: Monorepo
Ein Monorepo-Ansatz wird verfolgt, da Frontend und API-Logik eng verbunden sind.

### Service-Architektur: Monolithischer Ansatz (Backend-for-Frontend)
Eine monolithische Architektur, bei der das Backend direkt das Frontend bedient (via Next.js API Routes).

### Testanforderungen
Unit- und Integrationstests für kritische Geschäftslogik sind erforderlich.

### Zusätzliche technische Annahmen und Festlegungen
* **Frontend-Framework:** Next.js 14 (mit App Router), React 18
* **Styling:** Tailwind CSS
* **UI-Interaktion:** Swiper.js
* **PWA-Framework:** `next-pwa`
* **Backend & Datenbank:** Supabase (für Authentifizierung & PostgreSQL)
* **Speicher:** Supabase Storage
* **KI-Dienste (Text):** `openrouter: anthropic/claude-sonnet-4`
* **KI-Dienste (Bild):** `gpt-image-1`, `FLUX.1 Kontext`
* **Zusätzliche Werkzeuge:** `jsPDF` und `html2canvas` für den PDF-Export
* **Hosting & Deployment:** Vercel

## Epics

### Epic 1: Kernfunktionalität & MVP-Erlebnis
**Ziel:** Erstellung einer funktionierenden Grundversion, mit der Nutzer eine vollständige Geschichte generieren und im immersiven Buch-Modus durchblättern können.

* **Story 1.1: Initiales Projekt-Setup**
    * *Als Entwickler möchte ich ein grundlegendes Next.js-Projekt einrichten, damit eine solide Basis für die weitere Entwicklung existiert.*
    * AC: Next.js 14 Projekt erstellt; Tailwind CSS konfiguriert; PWA-Konfiguration eingerichtet; Projekt startet fehlerfrei.
* **Story 1.2: UI für den Erstellungs-Flow**
    * *Als Nutzer möchte ich durch eine intuitive, seitengestützte Oberfläche wischen, um alle Angaben für meine Geschichte zu machen.*
    * AC: Startbildschirm hat Optionen; Klick startet horizontalen Flow; Seite 1 für Thema/Typ; Seite 2 für Stil/Länge; Button "Erstellen" funktioniert wie spezifiziert.
* **Story 1.3: Anbindung der Text-KI**
    * *Als System möchte ich Nutzereingaben verarbeiten und an die Text-KI senden, um eine Geschichte zurückzuerhalten.*
    * AC: Sammelt Nutzereingaben; generiert korrekten Prompt für `claude-sonnet-4`; sendet Prompt; empfängt Antwort; zeigt Lade-Zustand an.
* **Story 1.4: Anbindung der Bild-KI**
    * *Als System möchte ich jeden Textabschnitt an die Bild-KI senden, um ein passendes Bild zu erhalten.*
    * AC: Generiert korrekten Prompt für Bild-KI; Prompt enthält Stil und Text; **fordert korrektes Seitenverhältnis an (9:16 für Mobil, Querformat für Desktop/Tablet)**; empfängt Bild-URLs; Lade-Zustand bleibt aktiv.
* **Story 1.5: Implementierung der Lese-Ansicht**
    * *Als Nutzer möchte ich die fertige Geschichte in einer ablenkungsfreien Vollbild-Ansicht sehen.*
    * AC: Leitet zu Lese-Ansicht; zeigt erstes Bild; Wischen navigiert; Fortschrittspunkte sind sichtbar; keine anderen UI-Elemente.
* **Story 1.6: End-of-Story-Flow und lokales Speichern**
    * *Als Nutzer möchte ich am Ende Optionen haben und die Geschichte speichern können.*
    * AC: End-Seite hat Optionen [Erneut lesen], [Neue Geschichte], [Geschichte weitererzählen]; Optionen funktionieren; [Speichern]-Button speichert im `localStorage`; "Meine Geschichten" zeigt lokal gespeicherte an.

### Epic 2: Nutzerbindung & Persistenz
**Ziel:** Einführung von Nutzerkonten, dauerhafte Speicherung der Geschichten in der Cloud und Implementierung der Export/Teil-Funktionen.

* **Story 2.1: UI für Registrierung und Login**
    * *Als neuer Nutzer möchte ich eine einfache Oberfläche für Registrierung und Login.*
    * AC: Separate UI für Login/Registrierung; klare Felder; visuelles Feedback bei Fehlern.
* **Story 2.2: Anbindung der Nutzer-Authentifizierung**
    * *Als Nutzer möchte ich mich registrieren und anmelden können.*
    * AC: UI mit Supabase Auth verbunden; Nutzer können erstellt/angemeldet werden; Weiterleitung nach Erfolg; Fehlermeldung bei Fehlschlag.
* **Story 2.3: Cloud-Speicherung für Geschichten**
    * *Als eingeloggter Nutzer möchte ich meine Geschichten in meinem Konto speichern.*
    * AC: "Speichern" speichert Story-Daten in Supabase DB und Bilder in Supabase Storage (verknüpft mit User-ID); ersetzt `localStorage` für eingeloggte Nutzer.
* **Story 2.4: "Meine Geschichten" aus der Cloud laden**
    * *Als eingeloggter Nutzer möchte ich meine Cloud-Geschichten sehen.*
    * AC: "Meine Geschichten" zeigt Liste aus Supabase an; Klick öffnet Geschichte; Leere-Zustand wird behandelt.
* **Story 2.5: PDF-Export-Funktion**
    * *Als Nutzer möchte ich eine Geschichte als PDF exportieren.*
    * AC: "Exportieren"-Button vorhanden; generiert PDF mit allen Seiten; bietet PDF zum Download an.
* **Story 2.6: Teilen-Funktion**
    * *Als Nutzer möchte ich einen Link zu einer Geschichte teilen.*
    * AC: "Teilen"-Option generiert öffentlichen Link; Link öffnet Lese-Ansicht ohne Login; nutzt Web Share API.

### Epic 3: PWA-Optimierung & Veröffentlichung
**Ziel:** Vervollständigung der PWA-Features, Optimierung der Performance und Vorbereitung für die Veröffentlichung.

* **Story 3.1: Implementierung einer robusten Offline-Strategie**
    * *Als Nutzer möchte ich, dass die App auch offline zuverlässig funktioniert.*
    * AC: Service Worker cacht App-Shell; Bilder werden bei Ansicht gecacht; App funktioniert offline mit geladenen Geschichten.
* **Story 3.2: Performance-Optimierung**
    * *Als Nutzer möchte ich, dass die App schnell lädt und flüssig reagiert.*
    * AC: Bilder optimiert (z.B. WebP); Code-Splitting aktiv; Lighthouse Score >90; First Contentful Paint <2s.
* **Story 3.3: Rich Previews für geteilte Links**
    * *Als Nutzer möchte ich, dass geteilte Links ansprechend aussehen.*
    * AC: Open-Graph-Meta-Tags sind vorhanden; Teilen auf Social Media erzeugt eine Vorschaukarte.
* **Story 3.4: Umfassendes End-to-End-Testing**
    * *Als Entwicklerteam möchten wir die App testen, um Fehler zu finden.*
    * AC: Flow auf Ziel-Browsern getestet; alle ACs verifiziert; Bug-Liste erstellt und priorisiert.
* **Story 3.5: Setup für die Produktions-Umgebung**
    * *Als Product Owner möchte ich, dass die Anwendung live geht.*
    * AC: Projekt mit Vercel Production verbunden; Umgebungsvariablen konfiguriert; Custom Domain eingerichtet; App ist live erreichbar.

---
