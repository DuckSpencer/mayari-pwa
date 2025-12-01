<objective>
Integriere Google's Nano Banana Bildgenerierungs-Modell in die Mayari App für verbesserte Charakterkonsistenz.

**Kontext:** User berichtet aus eigener Erfahrung, dass Nano Banana **deutlich bessere Charakterkonsistenz** liefert als FLUX.1. Das widerspricht meiner vorherigen Research-Einschätzung - die praktische Erfahrung des Users ist hier maßgeblich.

**Ziel:** Nano Banana als Alternative zu FLUX.1 implementieren, sodass User A/B Testing durchführen kann.
</objective>

<context>
**Mayari App Architektur:**
- Next.js 15.4 mit TypeScript (strict mode)
- fal.ai als Bildgenerierungs-Provider
- Bestehende FLUX.1 Integration in `src/lib/ai/fal.ts`
- Story-Generierung in `src/app/api/stories/generate/route.ts`

**Nano Banana Specs (laut fal.ai Docs):**
- **Model ID:** `fal-ai/nano-banana`
- **Endpoint:** `https://fal.run/fal-ai/nano-banana`
- **Provider:** Google's state-of-the-art image generation
- **Stärke:** Charakterkonsistenz (laut User-Erfahrung)

**Vorhandene Integration:**
- `@fal-ai/client` bereits installiert
- `FAL_KEY` in `.env` konfiguriert
- `FalClient` Klasse in `fal.ts` vorhanden
</context>

<requirements>
1. **Nano Banana Support in FalClient hinzufügen**
   - Neue Methode `generateImagesNanoBanana()` oder Model-Parameter erweitern
   - API-Mapping für Nano Banana spezifische Parameter

2. **API-Parameter-Mapping:**
   - `prompt` (string, required) ✅ vorhanden
   - `num_images` (integer, 1-4) ✅ vorhanden
   - `aspect_ratio` (enum) ⚠️ NEU (unterschiedlich zu FLUX `image_size`)
   - `output_format` (jpeg/png/webp) ✅ vorhanden
   - `sync_mode` (boolean) ✅ vorhanden

3. **ENV-Variable für Model-Switch:**
   - `.env` Variable für globalen Nano Banana vs FLUX Switch
   - Beispiel: `FAL_IMAGE_MODEL=nano-banana` oder `FAL_IMAGE_MODEL=flux-schnell`

4. **Backwards-Kompatibilität:**
   - FLUX.1 bleibt Standard (fallback)
   - Nano Banana ist opt-in via ENV oder Request-Parameter

5. **Aspect Ratio Mapping:**
   - FLUX nutzt `image_size: 'portrait_3_4'`
   - Nano Banana nutzt `aspect_ratio: '3:4'`
   - Intelligente Konvertierung implementieren
</requirements>

<implementation>
**Phase 1: fal.ts erweitern**

```typescript
// src/lib/ai/fal.ts

// Add Nano Banana support to FalImageRequest interface
export interface FalImageRequest {
  // ... existing fields ...
  model?: 'schnell' | 'dev' | 'pro' | 'nano-banana';  // ADD nano-banana
}

// Update FalClient class
export class FalClient {
  private apiKey: string;
  private modelId: string = process.env.FAL_IMAGE_MODEL || process.env.FAL_MODEL_ID || 'fal-ai/flux/schnell';

  async generateImages(request: FalImageRequest): Promise<FalImageResponse> {
    // Determine model ID
    const modelId = this.resolveModelId(request.model);

    // Prepare payload based on model
    const payload = this.preparePayload(modelId, request);

    // Make request
    const result = await this.makeRequestWithRetry(payload, modelId);

    return {
      success: true,
      images: this.extractImageUrls(result),
      seed: result.seed,
      timings: result.timings,
    };
  }

  private resolveModelId(modelOverride?: string): string {
    if (modelOverride === 'nano-banana') return 'fal-ai/nano-banana';
    if (modelOverride) return `fal-ai/flux/${modelOverride}`;
    return this.modelId;
  }

  private preparePayload(modelId: string, request: FalImageRequest): any {
    const isNanoBanana = modelId.includes('nano-banana');

    if (isNanoBanana) {
      return {
        prompt: request.prompt,
        num_images: request.num_images ?? 1,
        aspect_ratio: this.mapAspectRatio(request.image_size),  // Map image_size to aspect_ratio
        output_format: request.output_format ?? 'jpeg',
        sync_mode: request.sync_mode ?? false,
      };
    } else {
      // Existing FLUX payload logic
      return {
        prompt: request.prompt,
        image_size: request.image_size ?? 'portrait_3_4',
        num_inference_steps: request.num_inference_steps ?? 10,
        guidance_scale: request.guidance_scale ?? 4.0,
        // ... rest of FLUX params
      };
    }
  }

  private mapAspectRatio(imageSize?: string): string {
    // Map FLUX image_size to Nano Banana aspect_ratio
    switch (imageSize) {
      case 'portrait_3_4': return '3:4';
      case 'portrait_9_16': return '9:16';
      case 'landscape_4_3': return '4:3';
      case 'landscape_16_9': return '16:9';
      case 'square_1_1': return '1:1';
      default: return '3:4';  // Default to portrait for mobile
    }
  }
}
```

**Phase 2: .env konfigurieren**

```bash
# .env

# Image Model Selection (Global Switch)
# Options:
#   - fal-ai/flux/schnell (default): $0.01/img, baseline
#   - fal-ai/flux/dev: $0.03/img, better quality
#   - fal-ai/nano-banana: Google's model, excellent character consistency
# Uncomment to test Nano Banana:
# FAL_IMAGE_MODEL=fal-ai/nano-banana
```

**Phase 3: stories/generate/route.ts (optional per-request override)**

Keine Änderungen nötig! Die bestehende Story-Generierung nutzt automatisch das ENV-konfigurierte Modell.

Optional: Für A/B Testing kannst du per-request override hinzufügen:
```typescript
const resp = await falClient.generateImages({
  prompt,
  negative_prompt: negative,
  image_size: 'portrait_3_4',
  model: 'nano-banana',  // Optional: Override ENV setting
  // ... rest
})
```
</implementation>

<coding_guidelines>
ALWAYS apply these coding principles:
1. **Single Responsibility:** Jede Methode hat EIN klares Ziel (resolveModelId, preparePayload, mapAspectRatio)
2. **Backwards Compatibility:** FLUX bleibt Standard, Nano Banana ist opt-in
3. **Type Safety:** Alle neuen Parameter sind korrekt typisiert
4. **Fail-Safe:** Falls Nano Banana fehlschlägt, logge Error und informiere User
5. **Testability:** Model-Logic ist isoliert testbar (resolveModelId, mapAspectRatio)
6. **Keep Files Concise:** Neue Methoden sollten kompakt bleiben (<20 Zeilen)
</coding_guidelines>

<nano_banana_api_details>
**Aus der fal.ai Dokumentation:**

**Input Schema:**
```json
{
  "prompt": "string (required)",
  "num_images": "integer (1-4, default: 1)",
  "aspect_ratio": "enum (3:4, 9:16, 16:9, etc., default: 1:1)",
  "output_format": "enum (jpeg, png, webp, default: png)",
  "sync_mode": "boolean (default: false)"
}
```

**Output Schema:**
```json
{
  "images": [
    {
      "file_name": "string",
      "content_type": "string",
      "url": "string"
    }
  ],
  "description": "string"
}
```

**Key Differences vs FLUX:**
- Nutzt `aspect_ratio` (enum string) statt `image_size` (enum)
- Keine `num_inference_steps`, `guidance_scale`, `seed` Parameter
- Output hat `description` Feld (kann ignoriert werden)
</nano_banana_api_details>

<output>
Modifiziere folgende Dateien:

1. **`src/lib/ai/fal.ts`**
   - Erweitere `FalImageRequest` interface: `model?: 'schnell' | 'dev' | 'pro' | 'nano-banana'`
   - Füge hinzu: `resolveModelId()` private method
   - Füge hinzu: `preparePayload()` private method (model-spezifisch)
   - Füge hinzu: `mapAspectRatio()` private method
   - Update: `generateImages()` um Nano Banana zu unterstützen

2. **`.env`**
   - Füge hinzu: Kommentar mit `FAL_IMAGE_MODEL` Option
   - Dokumentiere Nano Banana als Option

3. **`CLAUDE.md`** (optional)
   - Update "AI Integration Details" Sektion mit Nano Banana Info
</output>

<verification>
Vor Abschluss prüfen:

1. **Code-Qualität:**
   - [ ] TypeScript kompiliert ohne Fehler
   - [ ] Alle neuen Methoden sind korrekt typisiert
   - [ ] Backwards-Kompatibilität: FLUX funktioniert weiterhin
   - [ ] Model-Resolution-Logic ist sauber und verständlich

2. **API-Mapping:**
   - [ ] Nano Banana `aspect_ratio` wird korrekt von `image_size` gemappt
   - [ ] Alle erforderlichen Nano Banana Parameter sind vorhanden
   - [ ] FLUX-spezifische Parameter werden NICHT an Nano Banana gesendet

3. **ENV-Konfiguration:**
   - [ ] `FAL_IMAGE_MODEL` ist dokumentiert in `.env`
   - [ ] Default bleibt FLUX schnell (backwards-compatible)

4. **Funktions-Test (optional):**
   - Setze `FAL_IMAGE_MODEL=fal-ai/nano-banana` in `.env`
   - Restart Dev-Server
   - Generiere Test-Story
   - Prüfe, ob Bilder via Nano Banana generiert werden
   - Prüfe Charakterkonsistenz über mehrere Seiten
</verification>

<success_criteria>
✅ Erfolgreich, wenn:
1. Nano Banana Integration ist vollständig in `fal.ts` implementiert
2. Model kann via `FAL_IMAGE_MODEL` ENV-Variable gewechselt werden
3. Aspect Ratio Mapping funktioniert korrekt (3:4, 9:16, etc.)
4. FLUX.1 bleibt als Standard (backwards-compatible)
5. TypeScript kompiliert ohne Fehler
6. User kann A/B Test durchführen: FLUX vs Nano Banana

**Erwartete User-Erfahrung nach Integration:**
1. User uncommented `FAL_IMAGE_MODEL=fal-ai/nano-banana` in `.env`
2. Restart Dev-Server
3. Generiere neue Story → Nano Banana wird genutzt
4. Charakterkonsistenz sollte sich **deutlich verbessern** (laut User-Feedback)

**Nächster Schritt für User:**
- Vergleiche FLUX schnell vs Nano Banana mit identischer Story
- Messe Charakterkonsistenz subjektiv über 8-12 Seiten
- Evaluiere, ob Nano Banana die Kostensteigerung wert ist
</success_criteria>

<cost_note>
⚠️ **Kosten-Hinweis:** Nano Banana Pricing ist noch nicht final recherchiert. User sollte:
1. Erste Test-Story generieren
2. fal.ai Dashboard prüfen für tatsächliche Kosten
3. Mit FLUX schnell ($0.01/img) vergleichen
4. Kosten-Nutzen-Analyse machen bevor Production-Switch
</cost_note>
