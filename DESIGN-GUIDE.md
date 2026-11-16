# Hyvän Tuulen Sauna — Typography & Colours

A compact reference extracted from the hosted site and its compiled CSS. Use this when adapting the standalone `/vibe` rebuild without changing the existing production components.

## Typography

### Font roles

| Role | Font | Weights | Current use |
|---|---|---|---|
| Display / editorial headings | **Corben** | 400, 700 | Hero headlines, section titles, feature titles |
| Body / interface text | **Quicksand** | 400, 500, 600, 700 | Paragraphs, navigation, labels, buttons, forms |
| Brand wordmark | **Pacifico** | 400 | “Hyvän Tuulen Sauna” in header, mobile menu and footer |

Compiled CSS variables on the hosted site:

```css
--font-display: "Corben", "Corben Fallback";
--font-quicksand: "Quicksand", "Quicksand Fallback";
--font-pacifico: "Pacifico", "Pacifico Fallback";
```

### Behaviour

- Display headings use `font-display` with tight but readable line heights.
- Body and UI use `font-quicksand`; ordinary body text is 400–500 and interactive text 600–700.
- The brand wordmark must remain Pacifico; do not replace it with the display font.
- Keep uppercase eyebrows small, semibold and letter-spaced.
- The alternative `/vibe` layout may change composition and copy, but should use these same font roles if the goal is to preserve the hosted typography.

## Colour system

### Brand and interaction colours

| Role | Name | Hex | Use |
|---|---|---|---|
| Primary blue | Lake | `#3B82F6` | Links, buttons, selected states, active calendar days |
| Primary hover | Lake Deep | `#2563EB` | Button and link hover states |
| Early Bird / warm CTA | Ember | `#D97E36` | Early Bird highlights, selected emphasis |
| Early Bird hover | Ember Dark | `#B95F1E` | Warm CTA hover |

The default `:root` mapping used on the hosted site is:

```css
--lake: #3b82f6;
--lake-deep: #2563eb;
--ember: #3b82f6;
--ember-dark: #2563eb;
```

The current `.theme-avanto` mapping is:

```css
--lake: #3b82f6;
--lake-deep: #2563eb;
--ember: #d97e36;
--ember-dark: #b95f1e;
```

### Canvas and neutral colours

#### Default / summer

| Token | Hex |
|---|---|
| Background | `#FAF9F7` |
| Foreground | `#1C1917` |
| Stone 50 | `#FAFAF9` |
| Stone 100 | `#F5F5F4` |
| Stone 200 | `#E7E5E4` |
| Stone 600 | `#57534E` |
| Stone 900 | `#1C1917` |

#### Current winter / Avanto

| Token | Hex |
|---|---|
| Background | `#F3F6F8` |
| Foreground | `#101820` |
| Stone 50 | `#F7FAFC` |
| Stone 100 | `#EDF3F8` |
| Stone 200 | `#D3DEE6` |
| Stone 600 | `#4A5A66` |
| Stone 900 | `#101820` |

### Usage rules

- Keep Lake for interactive colour, not for every surface.
- Use Ember only as an accent; it should not become a large page background.
- Use the warm neutral palette for ordinary content sections and the cooler Avanto neutrals for winter-specific compositions.
- Body copy should use dark neutral text. Do not place small Ember text on light surfaces.
- White content cards work on both the warm and cool canvases.

## Applying this to `/vibe`

The standalone preview keeps its own editorial layout, but when matching the hosted identity:

1. Load **Corben** for display text, **Quicksand** for body/UI, and **Pacifico** for the wordmark.
2. Map Lake and Lake Deep to the main interactive elements.
3. Reserve Ember for Early Bird and small warm highlights.
4. Retain the alternative page structure and copy rather than reverting to the production layout.

Source checked: `https://www.hyvantuulensauna.fi/` and its compiled `/_next/static/chunks/14g6yka4linkt.css`.
