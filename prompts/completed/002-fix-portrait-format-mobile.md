<objective>
Fix kritisches Bildformat-Problem: Bilder werden im Landscape-Format (4:3) generiert statt Portrait-Format für Mobile App.

**Problem:** Die Mayari App ist für Mobile-Nutzung (Portrait) konzipiert, aber die Bildgenerierung verwendet `landscape_4_3`, was zu abgeschnittenen Bildern führt (siehe User-Feedback: "Generats oben abgeschnitten").

**Ziel:** Ändere Bildformat von Landscape zu Portrait für optimale Mobile-Darstellung.
</objective>

<context>
Die Mayari App ist eine Progressive Web App (PWA) für Mobilgeräte, primär für **Portrait-Modus** gedacht. Aktuell werden Bilder im falschen Format generiert.

**Betroffene Datei:**
- `src/app/api/stories/generate/route.ts:236` - Zeile mit `image_size: 'landscape_4_3'`

**Tech Stack:**
- Next.js 15.4 API Routes
- fal.ai FLUX.1 für Bildgenerierung
- TypeScript (strict mode)
</context>

<requirements>
1. **Ändere Bildformat:** `landscape_4_3` → `portrait_3_4` für Mobile-optimierte Bilder
2. **Verifiziere alle Vorkommen:** Prüfe, ob das Format an mehreren Stellen gesetzt wird
3. **Teste Format-Logik:** Sicherstellen, dass keine Hardcoding-Probleme existieren
4. **Update Kommentare:** Falls vorhanden, aktualisiere Kommentare zum Bildformat
</requirements>

<implementation>
**Schritt 1: Lies die Datei**
```typescript
// src/app/api/stories/generate/route.ts
```

**Schritt 2: Finde und ändere image_size**
Suche nach:
```typescript
image_size: 'landscape_4_3',  // ❌ FALSCH für Mobile
```

Ändere zu:
```typescript
image_size: 'portrait_3_4',   // ✅ RICHTIG für Mobile Portrait
```

**Schritt 3: Prüfe weitere Vorkommen**
Suche in der gesamten Datei nach:
- `landscape_4_3`
- `image_size`
- Aspect Ratio Einstellungen

**Schritt 4: Verifiziere fal.ai API Kompatibilität**
Laut fal.ai Docs sind folgende Portrait-Formate verfügbar:
- `portrait_3_4` ✅ (empfohlen für Mobile)
- `portrait_9_16` (zu schmal für Story-Bilder)

Nutze `portrait_3_4` für optimale Balance.
</implementation>

<coding_guidelines>
ALWAYS apply these coding principles:
1. Single Responsibility: Jede Änderung hat EIN klares Ziel
2. Keine Breaking Changes: Format-Änderung darf keine Nebenwirkungen haben
3. Konsistenz: Prüfe, ob Format-Einstellung zentral oder verstreut ist
4. Kommentare: Füge kurzen Kommentar hinzu, WARUM portrait statt landscape
</coding_guidelines>

<output>
Modifiziere die Datei:
- `src/app/api/stories/generate/route.ts` - Ändere image_size von landscape_4_3 zu portrait_3_4

**Beispiel:**
```typescript
const resp = await falClient.generateImages({
  prompt,
  negative_prompt: negative,
  image_size: 'portrait_3_4',  // Portrait format for mobile app (3:4 aspect ratio)
  num_inference_steps: 10,
  guidance_scale: 4.0,
  output_format: 'jpeg',
  enable_safety_checker: true,
  num_images: 1,
  seed,
})
```
</output>

<verification>
Vor Abschluss prüfen:

1. **Code-Änderung:**
   - [ ] `landscape_4_3` wurde zu `portrait_3_4` geändert
   - [ ] Kommentar erklärt WARUM portrait (Mobile-Optimierung)
   - [ ] Keine weiteren landscape-Referenzen in der Datei

2. **Konsistenz-Check:**
   - [ ] Keine anderen Stellen in der Codebase setzen image_size
   - [ ] fal.ts unterstützt portrait_3_4 Format
   - [ ] TypeScript-Typen sind korrekt

3. **Funktions-Test (optional, nur wenn Dev-Server läuft):**
   - Generiere Test-Story
   - Prüfe, ob Bilder im Portrait-Format (höher als breit) generiert werden
   - Prüfe, ob Bilder nicht mehr oben abgeschnitten sind
</verification>

<success_criteria>
✅ Erfolgreich, wenn:
1. `image_size: 'portrait_3_4'` in `stories/generate/route.ts:236` gesetzt ist
2. Kommentar erklärt Mobile-Portrait-Rationale
3. Keine weiteren landscape-Referenzen existieren
4. TypeScript kompiliert ohne Fehler
5. (Optional) Test-Story zeigt Portrait-Bilder ohne Abschneiden

**Impact:** Bilder werden ab sofort im Mobile-optimierten Portrait-Format generiert, kein Abschneiden mehr.
</success_criteria>

<urgency>
🚨 **KRITISCH:** Dies ist ein SOFORTIGER Fix für User-erlebtes Problem. Höchste Priorität!
</urgency>
