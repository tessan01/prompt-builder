import { useState } from "react";

const fields = [
  { key: "role", label: "Roll", placeholder: "Vem ska Claude agera som?", hint: "t.ex. erfaren copywriter, senior utvecklare, marknadsanalytiker", icon: "◈" },
  { key: "context", label: "Kontext", placeholder: "Vad är bakgrunden?", hint: "t.ex. målgrupp, syfte, situation", icon: "◎" },
  { key: "task", label: "Uppgift", placeholder: "Vad ska Claude göra?", hint: "Var specifik och konkret", icon: "◆" },
  { key: "constraints", label: "Begränsningar", placeholder: "Regler, ton, längd, stil?", hint: "t.ex. max 200 ord, formell ton, inga buzzwords", icon: "◇" },
  { key: "format", label: "Format", placeholder: "Hur ska svaret se ut?", hint: "t.ex. punktlista, tabell, löpande text", icon: "▦" },
];

const templates = [
  { category: "Jobb", name: "Mejlskrivare", values: { role: "Kommunikationsexpert som skriver tydliga och professionella mejl", context: "Jag behöver skicka ett mejl till [person/roll] om [ämne]", task: "Skriv ett mejl som [vad du vill uppnå]", constraints: "Professionell ton, max 150 ord, tydlig och direkt", format: "Ämnesrad + hälsning + brödtext + avslutning" } },
  { category: "Jobb", name: "Mötesagenda", values: { role: "Erfaren projektledare med fokus på effektiva möten", context: "Jag ska hålla ett möte om [ämne] med [antal] personer", task: "Skapa en strukturerad agenda för ett [tidslängd]-möte", constraints: "Tydliga tidblock, konkreta mål per punkt, avsätt tid för beslut", format: "Numrerad lista med tidblock och ansvarig person per punkt" } },
  { category: "Jobb", name: "Presentationsstruktur", values: { role: "Kommunikationsstrateg med erfarenhet av affärspresentationer", context: "Jag ska presentera [ämne] för [målgrupp] på [tidslängd]", task: "Skapa en struktur och manuskript för presentationen", constraints: "Engagerande öppning, tydligt budskap per slide, stark avslutning", format: "Slide-för-slide med rubrik, innehåll och talarnoteringar" } },
  { category: "Jobb", name: "Innehållsskapare", values: { role: "Erfaren content creator som specialiserar sig på kortformat", context: "Jag bygger ett varumärke inom [ämne] och vill nå [målgrupp]", task: "Skriv 5 idéer till LinkedIn-inlägg om [ämne]", constraints: "Varje idé max 2 meningar, engagerande hook i första meningen", format: "Numrerad lista med rubrik + kort beskrivning per idé" } },
  { category: "Skola", name: "Uppsatsplan", values: { role: "Akademisk skrivcoach med erfarenhet av högskolenivå", context: "Jag ska skriva en uppsats om [ämne] på [sidantal] sidor", task: "Hjälp mig skapa en strukturerad disposition med tydliga argument", constraints: "Akademisk ton, logisk uppbyggnad, balanserade argument", format: "Disposition med rubriker, underrubriker och korta beskrivningar per del" } },
  { category: "Skola", name: "Tentaplugg", values: { role: "Pedagogisk tutor som förklarar komplex information enkelt", context: "Jag ska ha tenta i [ämne] om [antal dagar] dagar", task: "Skapa en studieplan och sammanfatta de viktigaste begreppen", constraints: "Tydliga förklaringar, konkreta exempel, realistiskt schema", format: "Studieplan dag-för-dag + begreppsförklaringar med exempel" } },
  { category: "Skola", name: "Källanalys", values: { role: "Analytisk forskare med förmåga att granska information kritiskt", context: "Jag ska analysera [källa/text] för en uppgift i [ämne]", task: "Hjälp mig analysera källan och identifiera huvudargument och svagheter", constraints: "Objektiv analys, lyft fram både styrkor och svagheter, akademisk ton", format: "Sammanfattning + huvudargument + kritisk granskning + slutsats" } },
  { category: "Privat", name: "Veckoplanering", values: { role: "Personlig assistent som är duktig på att strukturera och prioritera", context: "Jag har mycket på gång och behöver struktur på min vecka", task: "Hjälp mig skapa en realistisk veckoplan utifrån dessa uppgifter: [lista uppgifter]", constraints: "Max 5 uppgifter per dag, inkludera återhämtning, realistiskt tempo", format: "Dag-för-dag-schema med tidsblock och prioriteringar" } },
  { category: "Privat", name: "Beslutsstöd", values: { role: "Analytisk rådgivare som hjälper till att fatta välgrundade beslut", context: "Jag funderar på [beslut] och är osäker på vad som är rätt val", task: "Hjälp mig analysera beslutet och väga för- och nackdelar", constraints: "Objektiv analys, lyft fram risker, inga förhastade slutsatser", format: "Sammanfattning av situationen + för/nackdel-lista + rekommendation" } },
  { category: "Privat", name: "Matplanering", values: { role: "Kock som specialiserar sig på enkel och nyttig vardagsmat", context: "Jag vill äta mer varierat men har max 30 minuter per kväll", task: "Skapa en veckomeny med 5 middagar och tillhörande inköpslista", constraints: "Max 30 min tillagningstid, vanliga ingredienser, budgetvänligt", format: "Dag + rätt + tillagningstid, följt av samlad inköpslista per kategori" } },
  { category: "Privat", name: "Träningsplan", values: { role: "Personlig tränare med fokus på hållbara och realistiska träningsvanor", context: "Jag vill komma igång med träning men har [tid] tillgänglig per vecka", task: "Skapa ett träningsprogram anpassat för [nivå] som passar min vardag", constraints: "Realistiskt, progressivt upplägg, inkludera vila och återhämtning", format: "Veckoschema med pass, övningar, set och reps" } },
  { category: "Kreativt", name: "Kodassistent", values: { role: "Senior utvecklare med fokus på ren och välkommenterad kod", context: "Jag håller på att bygga [projekt] och behöver hjälp med [funktion]", task: "Bygg [funktionen] med tydliga kommentarer som förklarar varje del", constraints: "Läsbar kod, förklara logiken, inga onödiga externa bibliotek", format: "Komplett kodfil med kommentarer + kort förklaring av hur det fungerar" } },
  { category: "Kreativt", name: "Research-assistent", values: { role: "Analytisk forskare med förmåga att sammanfatta komplex information", context: "Jag ska sätta mig in i [ämne] och behöver en snabb överblick", task: "Sammanfatta det viktigaste om [ämne] och ge mig en bra startpunkt", constraints: "Håll dig till fakta, lyft fram osäkerheter, max 400 ord", format: "Översikt + nyckelbegrepp + rekommenderade nästa steg" } },
];

const categories = ["Alla", "Jobb", "Skola", "Privat", "Kreativt"];

export default function PromptBuilder() {
  const [values, setValues] = useState({ role: "", context: "", task: "", constraints: "", format: "" });
  const [copied, setCopied] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Alla");
  const [adding, setAdding] = useState(false);

  const update = (key, val) => { setValues((v) => ({ ...v, [key]: val })); setActiveTemplate(null); };
  const applyTemplate = (t, i) => { setValues(t.values); setActiveTemplate(i); };
  const reset = () => { setValues({ role: "", context: "", task: "", constraints: "", format: "" }); setActiveTemplate(null); setCopied(false); };

  const buildPrompt = () => fields.filter((f) => values[f.key]?.trim()).map((f) => `${f.label.toUpperCase()}: ${values[f.key].trim()}`).join("\n\n");
  const prompt = buildPrompt();
  const filled = fields.filter((f) => values[f.key]?.trim()).length;

  const copy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTemplates = activeCategory === "Alla" ? templates : templates.filter((t) => t.category === activeCategory);

  const c = {
    bg: "#f5f5f3",
    surface: "#ffffff",
    border: "#e2e2de",
    borderActive: "#1a1a1a",
    text: "#1a1a1a",
    textSub: "#6b6b6b",
    textMuted: "#a0a0a0",
    accent: "#1a1a1a",
    accentBg: "#f0f0ee",
    green: "#1a7a4a",
    greenBg: "#f0faf4",
  };

  return (
    <div style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", background: c.bg, minHeight: "100vh", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: c.surface, borderBottom: `1px solid ${c.border}`, padding: "24px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: c.text }}>Prompt Builder</h1>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: c.textSub }}>Bygg strukturerade prompts med Perfect Prompt-formeln</p>
          </div>
          {filled > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 120, height: 4, background: c.border, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(filled / 5) * 100}%`, background: c.accent, borderRadius: 99, transition: "width 0.3s" }} />
              </div>
              <span style={{ fontSize: 12, color: c.textMuted }}>{filled}/5</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px" }}>

        {/* Layout: 2 columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* Left: Fields */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: c.textMuted, textTransform: "uppercase" }}>Fyll i fälten</span>
              {filled > 0 && (
                <button onClick={reset} style={{ background: "none", border: "none", fontSize: 12, color: c.textMuted, cursor: "pointer", padding: 0 }}>Rensa</button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {fields.map((f) => {
                const isFilled = !!values[f.key]?.trim();
                return (
                  <div key={f.key} style={{
                    background: c.surface,
                    border: `1px solid ${isFilled ? c.borderActive : c.border}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    transition: "border-color 0.15s",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: isFilled ? c.text : c.textMuted }}>{f.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: isFilled ? c.text : c.textMuted }}>{f.label}</span>
                      {isFilled && <span style={{ marginLeft: "auto", fontSize: 11, color: c.green }}>✓</span>}
                    </div>
                    <textarea
                      value={values[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      rows={2}
                      style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: c.text, fontSize: 13, lineHeight: 1.6, resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
                    />
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: c.textMuted }}>{f.hint}</p>
                  </div>
                );
              })}
            </div>

            {/* Output */}
            {prompt && (
              <div style={{ marginTop: 12, background: c.surface, border: `1px solid ${c.border}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: c.textMuted, textTransform: "uppercase" }}>Färdig prompt</span>
                  <button onClick={copy} style={{
                    padding: "6px 14px", borderRadius: 6, border: "none",
                    background: copied ? c.greenBg : c.accent,
                    color: copied ? c.green : "#fff",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                  }}>
                    {copied ? "Kopierat" : "Kopiera"}
                  </button>
                </div>
                <pre style={{ margin: 0, fontFamily: "'JetBrains Mono','Courier New',monospace", fontSize: 12, lineHeight: 1.8, color: c.textSub, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {prompt}
                </pre>
              </div>
            )}
          </div>

          {/* Right: Templates */}
          <div>
            <div style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: c.textMuted, textTransform: "uppercase" }}>Mallar</span>
            </div>

            {/* Category filter */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding: "5px 12px", borderRadius: 6,
                  border: `1px solid ${activeCategory === cat ? c.borderActive : c.border}`,
                  background: activeCategory === cat ? c.accent : c.surface,
                  color: activeCategory === cat ? "#fff" : c.textSub,
                  fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Template grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {filteredTemplates.map((t, i) => {
                const realIndex = templates.indexOf(t);
                const isActive = activeTemplate === realIndex;
                return (
                  <button key={i} onClick={() => applyTemplate(t, realIndex)} style={{
                    padding: "12px 14px", borderRadius: 10, textAlign: "left",
                    border: `1px solid ${isActive ? c.borderActive : c.border}`,
                    background: isActive ? c.accentBg : c.surface,
                    cursor: "pointer", transition: "all 0.15s",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 2 }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: c.textMuted }}>{t.category}</div>
                    </div>
                    {isActive && <span style={{ fontSize: 11, color: c.green }}>Vald</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
