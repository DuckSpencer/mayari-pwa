<research_objective>
Entwickle eine umfassende Lösung für das kritische Problem der Charakterinkonsistenz und Bildqualität in der Mayari Children's Storybook Generator App.

**Kontext:** Die App funktioniert grundsätzlich, aber die generierten Bilder leiden unter zwei Hauptproblemen:
1. **Charakterinkonsistenz:** Hauptcharaktere sehen von Seite zu Seite völlig unterschiedlich aus (verschiedene Gesichtszüge, Kleidung, Stil)
2. **Bildqualität:** Generelle Qualitätsprobleme beeinträchtigen das Nutzererlebnis

Diese Probleme sind kritisch, da die visuelle Konsistenz und Qualität das Kernerlebnis der App ausmachen. Die App generiert 8-16 Bilder pro Story, daher ist eine kosteneffiziente Lösung wichtig (aktuell ~$0.01 pro Bild mit FLUX.1 schnell).

**Ziel:** Recherchiere, analysiere und erstelle einen konkreten Implementierungsplan mit klaren Handlungsempfehlungen.
</research_objective>

<scope>
**Phase 1: Analyse der aktuellen Implementierung**

Untersuche gründlich die bestehende Mayari-Bildgenerierungs-Pipeline:

1. **Code-Analyse:**
   - Lies und analysiere `src/lib/ai/fal.ts` - Der FalClient und seine Methoden
   - Lies und analysiere `src/lib/ai/image-service.ts` - High-level Image Service
   - Lies und analysiere `src/app/api/images/generate/route.ts` - API-Endpunkt
   - Lies und analysiere `src/app/api/stories/generate/route.ts` - Story-Generierung inkl. Bildintegration
   - Verstehe, wie Prompts aktuell konstruiert werden (Stil-Deskriptoren, Charakterbeschreibungen)

2. **Aktuelle Prompt-Strategie identifizieren:**
   - Wie werden Charaktere beschrieben?
   - Gibt es Konsistenz-Mechanismen (z.B. Charakter-Referenzen, Seed-Management)?
   - Welche Parameter werden an FLUX.1 übergeben?
   - Wie werden die 4 Art Styles gemappt (peppa-pig, pixi-book, watercolor, comic)?

3. **Probleme dokumentieren:**
   - Warum entstehen inkonsistente Charaktere? (fehlende Charakter-Referenzen, keine Style-Verankerung?)
   - Welche technischen Limitierungen hat FLUX.1 schnell?

**Phase 2: Best Practices Research**

Recherchiere umfassend, wie ähnliche Apps und Services dieses Problem lösen:

1. **Vergleichbare Apps analysieren:**
   - Wie lösen Apps wie "StoryBird", "Childbook.ai", "Oscar Stories", "Bedtime Story AI" das Konsistenzproblem?
   - Welche Techniken verwenden professionelle AI-Story-Generatoren?

2. **Technische Ansätze recherchieren:**
   - **Character Reference Techniques:** LoRA, DreamBooth, IP-Adapter, Character Sheets
   - **Prompt Engineering:** Advanced prompting für Konsistenz (Detailbeschreibungen, Style-Anchoring)
   - **Seed Management:** Wie Seeds für konsistente Charaktere nutzen?
   - **Multi-Modal Approaches:** Text-to-Image + Image-to-Image für Konsistenz
   - **Model-specific Features:** Welche Features bieten moderne Modelle (FLUX, SD, Ideogram)?

3. **API-Provider vergleichen:**
   - **fal.ai:** Welche FLUX-Varianten bieten sie? (dev vs schnell vs pro)
   - **Replicate:** FLUX, Stable Diffusion, andere Modelle
   - **Together.ai:** Modelle und Preise
   - **Ideogram:** Bekannt für Text-in-Images und Konsistenz
   - **Leonardo.ai:** Character Reference Features

**Phase 3: Nano Banana Pro & Alternative Modelle evaluieren**

Recherchiere speziell Nano Banana Pro und vergleiche mit Alternativen:

1. **Nano Banana Pro:**
   - Was ist Nano Banana Pro? (Modell-Details, Anbieter, Verfügbarkeit)
   - Kosten pro Bild vs FLUX.1 schnell
   - Qualität und Geschwindigkeit
   - Character Consistency Features
   - API-Integration (SDKs, Endpoints)

2. **Modell-Vergleich erstellen:**
   | Modell | Kosten/Bild | Geschwindigkeit | Qualität | Konsistenz-Features | API-Verfügbarkeit |
   |--------|-------------|-----------------|----------|---------------------|-------------------|
   | FLUX.1 schnell (current) | ~$0.01 | ~1.6s | ? | ? | ✓ fal.ai |
   | FLUX.1 dev | ? | ? | ? | ? | ? |
   | Nano Banana Pro | ? | ? | ? | ? | ? |
   | Ideogram v2 | ? | ? | ? | ? | ? |
   | ... | ... | ... | ... | ... | ... |

3. **Kosten-Nutzen-Analyse:**
   - Bei 12 Bildern pro Story: Gesamtkosten pro Story
   - Bei 100 Stories/Monat: Monatliche Kosten
   - Qualitätsverbesserung vs Kostensteigerung bewerten
</scope>

<deliverables>
Erstelle ein umfassendes Research-Dokument mit klaren Handlungsempfehlungen:

**Dokument-Struktur:** `./research/image-consistency-improvement-plan.md`

```markdown
# Mayari Image Consistency & Quality Improvement Plan

## Executive Summary
[Kernproblem, beste Lösung, erwartete Verbesserungen, Kosten-Impact]

## 1. Current Implementation Analysis

### 1.1 Code Review Findings
[Was macht der aktuelle Code? Wo sind die Schwachstellen?]

### 1.2 Current Prompt Strategy
[Beispiele aktueller Prompts, was fehlt für Konsistenz?]

### 1.3 Root Cause Analysis
[Warum entstehen inkonsistente Charaktere technisch?]

## 2. Best Practices from Industry

### 2.1 How Similar Apps Solve This
[Konkrete Beispiele von StoryBird, Childbook.ai, etc.]

### 2.2 Technical Approaches
[Character Reference, Prompt Engineering, Seeds, Multi-Modal, etc.]

### 2.3 Key Learnings
[Was können wir direkt übernehmen?]

## 3. Model & Provider Comparison

### 3.1 Nano Banana Pro Analysis
[Details zu Nano Banana Pro - ist es eine gute Wahl?]

### 3.2 Model Comparison Table
[Vollständige Tabelle mit Kosten, Features, Pros/Cons]

### 3.3 Provider API Features
[Welcher Provider bietet beste Character Consistency Tools?]

## 4. Recommended Solution

### 4.1 Primary Recommendation
**Approach:** [z.B. "FLUX.1 dev mit Advanced Prompt Engineering + Character Seeds"]

**Why:** [Begründung basierend auf Research]

**Implementation Steps:**
1. [Konkrete Schritte]
2. [...]

**Expected Results:**
- Charakterkonsistenz: [Verbesserung]
- Bildqualität: [Verbesserung]
- Kosten: [Impact]
- Geschwindigkeit: [Impact]

### 4.2 Alternative Approaches
[Backup-Lösungen falls Hauptlösung nicht funktioniert]

## 5. Implementation Roadmap

### Phase 1: Quick Wins (1-2 Tage)
- [ ] [Konkrete Aufgabe mit Zeitschätzung]
- [ ] [...]

### Phase 2: Core Improvements (3-5 Tage)
- [ ] [...]

### Phase 3: Advanced Features (Optional)
- [ ] [...]

## 6. Cost-Benefit Analysis

### Current State
- Model: FLUX.1 schnell
- Cost per image: ~$0.01
- Cost per story (12 images): ~$0.12
- Monthly cost (100 stories): ~$12

### Proposed Solution
- Model: [...]
- Cost per image: [...]
- Cost per story (12 images): [...]
- Monthly cost (100 stories): [...]
- **Cost increase:** [X%]
- **Quality improvement:** [beschreiben]

### ROI Assessment
[Ist die Qualitätsverbesserung die Kostensteigerung wert?]

## 7. Code Changes Required

### 7.1 Modified Files
- `src/lib/ai/fal.ts` - [Was ändern?]
- `src/lib/ai/image-service.ts` - [Was ändern?]
- `src/app/api/stories/generate/route.ts` - [Was ändern?]
- [Neue Files falls nötig]

### 7.2 New Environment Variables
```bash
# Falls neue API-Keys nötig
NEW_IMAGE_API_KEY=...
```

### 7.3 Migration Strategy
[Wie migrieren wir bestehende Stories? A/B Testing?]

## 8. Testing & Validation Plan

### Test Cases
1. [Generiere Story mit gleichem Charakter über 8 Seiten - prüfe Konsistenz]
2. [...]

### Success Metrics
- [ ] Charaktere haben konsistente Merkmale (Gesicht, Kleidung, Stil)
- [ ] Bildqualität subjektiv besser
- [ ] Kosten bleiben im Rahmen (~50% Erhöhung max)
- [ ] Generierungszeit akzeptabel (<5s pro Bild)

## 9. Risks & Mitigation

### Risk 1: Kostensteigerung zu hoch
**Mitigation:** [...]

### Risk 2: Neue API-Integration komplex
**Mitigation:** [...]

## 10. Next Actions

**Immediate:**
1. [Konkrete nächste Schritte]
2. [...]

**Short-term (diese Woche):**
1. [...]

**Medium-term (nächste 2 Wochen):**
1. [...]
```

Speichere das Research-Dokument als: `./research/image-consistency-improvement-plan.md`
</deliverables>

<research_approach>
**Für umfassende Recherche nutze:**

1. **Web Search:** Suche nach:
   - "AI story generator character consistency"
   - "FLUX.1 character reference techniques"
   - "Nano Banana Pro image model"
   - "Childbook.ai how does it work"
   - "Best practices AI children's book illustration"
   - "Image generation API comparison 2024"

2. **Technische Dokumentation:**
   - Prüfe fal.ai Dokumentation für alle verfügbaren FLUX-Varianten
   - Recherchiere Nano Banana Pro Provider und API-Docs
   - Untersuche Replicate, Together.ai, Ideogram APIs

3. **Code-Analyse:**
   - Lies die aktuellen Mayari-Files gründlich
   - Verstehe die bestehende Architektur
   - Identifiziere Änderungspunkte

4. **Vergleichende Analyse:**
   - Recherchiere mindestens 3-5 ähnliche Apps
   - Dokumentiere deren Ansätze
   - Extrahiere übertragbare Strategien
</research_approach>

<evaluation_criteria>
**Qualitätskriterien für das Research:**

1. **Vollständigkeit:**
   - [ ] Alle 10 Sections des Dokuments sind ausgefüllt
   - [ ] Mindestens 3 ähnliche Apps analysiert
   - [ ] Mindestens 4 alternative Modelle verglichen
   - [ ] Kosten-Nutzen-Analyse mit konkreten Zahlen

2. **Actionability:**
   - [ ] Klare Haupt-Empfehlung mit Begründung
   - [ ] Konkrete Implementation Steps (keine abstrakten Ideen)
   - [ ] Zeitschätzungen für jede Phase
   - [ ] Code-Änderungen sind spezifiziert

3. **Quellenqualität:**
   - [ ] Technische Informationen sind aktuell (2024/2025)
   - [ ] API-Preise und Features sind verifiziert
   - [ ] Best Practices stammen von etablierten Quellen
   - [ ] Nano Banana Pro ist gründlich evaluiert

4. **Praktikabilität:**
   - [ ] Lösung passt zur Mayari-Architektur (Next.js, TypeScript, Supabase)
   - [ ] Kostenerhöhung bleibt im Rahmen (~50% max)
   - [ ] Implementation ist realistisch umsetzbar (nicht theoretisch)
   - [ ] Risiken sind identifiziert mit Mitigation-Strategien

5. **Business Value:**
   - [ ] Klare Verbesserung der Charakterkonsistenz
   - [ ] Verbesserung der Bildqualität
   - [ ] ROI ist nachvollziehbar dargestellt
   - [ ] Alternative Ansätze als Backup vorhanden
</evaluation_criteria>

<verification>
Vor Abschluss des Research, stelle sicher:

1. **Code wurde gelesen:**
   - `src/lib/ai/fal.ts` wurde analysiert
   - `src/lib/ai/image-service.ts` wurde analysiert
   - `src/app/api/stories/generate/route.ts` wurde analysiert
   - Aktuelle Prompt-Konstruktion ist verstanden

2. **Research ist umfassend:**
   - Web-Recherche zu Nano Banana Pro durchgeführt
   - Mindestens 3 ähnliche Apps recherchiert
   - Modell-Vergleichstabelle ist vollständig ausgefüllt
   - Best Practices sind dokumentiert mit Quellen

3. **Empfehlung ist konkret:**
   - Eine klare Haupt-Empfehlung existiert
   - Implementation Steps sind spezifisch (keine "TODO" oder "TBD")
   - Kosten-Impact ist quantifiziert
   - Code-Änderungen sind skizziert

4. **Dokument ist vollständig:**
   - Alle 10 Sections sind ausgefüllt
   - Markdown-Formatierung ist korrekt
   - Tabellen sind vollständig
   - Checkboxen sind bei Action Items vorhanden

5. **Plan ist umsetzbar:**
   - Nächste Schritte sind klar definiert
   - Zeitschätzungen sind realistisch
   - Risiken sind adressiert
   - Testing-Strategie ist vorhanden
</verification>

<success_criteria>
**Das Research ist erfolgreich, wenn:**

1. Ein vollständiges `./research/image-consistency-improvement-plan.md` existiert
2. Eine klare, begründete Haupt-Empfehlung vorliegt (inkl. Modell-Wahl)
3. Konkrete Implementation Steps mit Zeitschätzungen definiert sind
4. Kosten-Nutzen-Analyse mit Zahlen vorliegt
5. Code-Änderungen spezifiziert sind (welche Files, was ändern)
6. Alternative Ansätze als Backup dokumentiert sind
7. Nano Banana Pro gründlich evaluiert wurde (inkl. ob es überhaupt geeignet ist)
8. Mindestens 3 ähnliche Apps analysiert wurden
9. Testing & Validation Plan existiert
10. Alle Verification-Punkte sind erfüllt

**Nächster Schritt nach diesem Research:**
Der Nutzer kann basierend auf diesem Dokument entscheiden, ob er direkt mit der Implementation starten will (dann erstellen wir einen Folge-Prompt für die Implementation) oder ob noch weitere Research-Bereiche zu klären sind.
</success_criteria>

<meta_note>
Dieser Prompt ist bewusst umfassend, da das Problem kritisch für die App ist. Er kombiniert:
- Code-Analyse (verstehe aktuelle Implementierung)
- Competitive Research (lerne von ähnlichen Apps)
- Technical Research (Modelle, APIs, Best Practices)
- Business Analysis (Kosten-Nutzen)
- Actionable Recommendations (konkrete nächste Schritte)

Der Output ist ein fundiertes Strategiedokument, das als Basis für Implementation Decisions dient.
</meta_note>
