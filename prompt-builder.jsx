import { useState } from "react";

const fields = [
  {
    key: "role",
    label: "ROLL",
    placeholder: "Vem ska Claude agera som?",
    hint: "t.ex. erfaren copywriter, livsstilscoach, kreativ skribent",
    icon: "🎀",
  },
  {
    key: "context",
    label: "KONTEXT",
    placeholder: "Vad är bakgrunden?",
    hint: "t.ex. målgrupp, syfte, vad det gäller",
    icon: "🌸",
  },
  {
    key: "task",
    label: "UPPGIFT",
    placeholder: "Vad ska Claude göra?",
    hint: "Var specifik och konkret",
    icon: "✨",
  },
  {
    key: "constraints",
    label: "BEGRÄNSNINGAR",
    placeholder: "Regler, ton, längd, stil?",
    hint: "t.ex. max 200 ord, varm och personlig ton, inga buzzwords",
    icon: "🪄",
  },
  {
    key: "format",
    label: "FORMAT",
    placeholder: "Hur ska svaret se ut?",
    hint: "t.ex. punktlista, tabell, löpande text med rubriker",
    icon: "💌",
  },
];

const templates = [
  {
    name: "✍️ Innehållsskapare",
    emoji: "✍️",
    values: {
      role: "Erfaren content creator som specialiserar sig på kortformat",
      context: "Jag bygger ett personligt varumärke inom [ämne] och vill nå en bred svensk publik",
      task: "Skriv 5 idéer till TikTok-videor om [ämne]",
      constraints: "Varje idé max 2 meningar, inga klichéer, hook i första meningen",
      format: "Numrerad lista med rubrik + kort beskrivning per idé",
    },
  },
  {
    name: "💻 Kodassistent",
    emoji: "💻",
    values: {
      role: "Senior fullstack-utvecklare med fokus på ren och läsbar kod",
      context: "Jag är nybörjare på programmering och håller på att lära mig React",
      task: "Bygg en enkel todo-app med möjlighet att lägga till och ta bort uppgifter",
      constraints: "Förklara varje del av koden, håll det enkelt, inga externa bibliotek",
      format: "Komplett kodfil med kommentarer som förklarar vad varje del gör",
    },
  },
  {
    name: "🔍 Research",
    emoji: "🔍",
    values: {
      role: "Analytisk forskare med förmåga att sammanfatta komplex information",
      context: "Jag ska ta ett beslut om [ämne] och behöver förstå för- och nackdelar",
      task: "Analysera [ämne] och ge mig de viktigaste insikterna",
      constraints: "Håll dig till fakta, lyft fram osäkerheter, max 400 ord",
      format: "Sammanfattning + för/nackdel-lista + rekommendation",
    },
  },
  {
    name: "📅 Plannerhjälp",
    emoji: "📅",
    values: {
      role: "Personlig assistent som är duktig på att strukturera och prioritera",
      context: "Jag har mycket på gång och känner mig överväldigad av min to-do-lista",
      task: "Hjälp mig skapa en realistisk veckoplan utifrån dessa uppgifter: [lista dina uppgifter]",
      constraints: "Max 5 uppgifter per dag, inkludera tid för återhämtning, realistiskt tempo",
      format: "Dag-för-dag-schema med tidsblock och korta motiveringar",
    },
  },
  {
    name: "💌 Mejlskrivare",
    emoji: "💌",
    values: {
      role: "Kommunikationsexpert som skriver tydliga och professionella mejl",
      context: "Jag behöver skicka ett mejl till [person/roll] om [ämne]",
      task: "Skriv ett mejl som [vad du vill uppnå, t.ex. boka möte / be om feedback / följa upp]",
      constraints: "Varm men professionell ton, max 150 ord, tydlig avsändare",
      format: "Ämnesrad + hälsning + brödtext + avslutning",
    },
  },
  {
    name: "🌿 Självutveckling",
    emoji: "🌿",
    values: {
      role: "Empatisk livsstilscoach med fokus på hållbara vanor",
      context: "Jag vill bli bättre på [vana] men har svårt att hålla i det över tid",
      task: "Skapa en 30-dagars plan för att bygga vanan [vana] steg för steg",
      constraints: "Realistiskt för en vanlig vardag, max 15 minuter per dag, positiv ton",
      format: "Veckovis uppdelning med dagliga mikrouppgifter och reflektionsfrågor",
    },
  },
  {
    name: "🛍️ Shopping-stylist",
    emoji: "🛍️",
    values: {
      role: "Personlig stylist med känsla för både stil och budget",
      context: "Jag har en garderob full av kläder men känner att jag aldrig har något att ha på mig",
      task: "Hjälp mig bygga 10 outfits utifrån basplagg som [beskriv vad du har]",
      constraints: "Vardagsanpassat, blanda högt och lågt, inga trendplagg som går ur mode",
      format: "Numrerad lista med outfit + tillfälle + styling-tips",
    },
  },
  {
    name: "🍽️ Matplanering",
    emoji: "🍽️",
    values: {
      role: "Kreativ kock som specialiserar sig på enkel och nyttig vardagsmat",
      context: "Jag vill äta mer varierat men har max 30 minuter per kväll till matlagning",
      task: "Skapa en veckomeny med 5 middagar och tillhörande inköpslista",
      constraints: "Max 30 min tillagningstid, inga exotiska ingredienser, budget-vänligt",
      format: "Dag + rätt + tillagningstid, följt av samlad inköpslista sorterad efter kategori",
    },
  },
];

export default function PromptBuilder() {
  const [values, setValues] = useState({ role: "", context: "", task: "", constraints: "", format: "" });
  const [copied, setCopied] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);

  const update = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }));
    setActiveTemplate(null);
  };

  const applyTemplate = (t, i) => {
    setValues(t.values);
    setActiveTemplate(i);
  };

  const reset = () => {
    setValues({ role: "", context: "", task: "", constraints: "", format: "" });
    setActiveTemplate(null);
    setCopied(false);
  };

  const buildPrompt = () => {
    const parts = fields
      .filter((f) => values[f.key]?.trim())
      .map((f) => `${f.label}: ${values[f.key].trim()}`);
    return parts.join("\n\n");
  };

  const prompt = buildPrompt();
  const filled = fields.filter((f) => values[f.key]?.trim()).length;

  const copy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pastel palette
  const pink = "#f9a8c9";
  const softPink = "#fce4f0";
  const lavender = "#e8d5f5";
  const mint = "#c8f0e8";
  const peach = "#fde8d8";
  const bg = "#fff8fb";
  const cardBg = "#ffffff";
  const border = "#f0d6e8";
  const activeBorder = "#e879b0";
  const activeText = "#c0508a";
  const textMain = "#3a2030";
  const textSub = "#9a7090";
  const textHint = "#c8a8bc";

  const fieldAccents = ["#f9a8c9", "#b5d8f7", "#c8f0e8", "#e8d5f5", "#fde8d8"];

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", background: bg, minHeight: "100vh", padding: "0 0 60px" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #fce4f0 0%, #ede4f8 50%, #d4eef8 100%)",
        borderBottom: `1px solid ${border}`,
        padding: "32px 24px 24px",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>🌸</span>
            <span style={{ color: activeText, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Claude Mastery Map</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: -0.5, color: textMain }}>
            Prompt Builder
          </h1>
          <p style={{ margin: "6px 0 0", color: textSub, fontSize: 14 }}>Bygg kraftfulla prompts med Perfect Prompt-formeln ✨</p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>

        {/* Templates */}
        <div style={{ marginTop: 28, marginBottom: 20 }}>
          <p style={{ margin: "0 0 12px", fontSize: 11, color: textSub, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Välj en mall 💫
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {templates.map((t, i) => (
              <button
                key={i}
                onClick={() => applyTemplate(t, i)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 20,
                  border: `1.5px solid ${activeTemplate === i ? activeBorder : border}`,
                  background: activeTemplate === i
                    ? "linear-gradient(135deg, #fce4f0, #ede4f8)"
                    : cardBg,
                  color: activeTemplate === i ? activeText : textSub,
                  fontSize: 13,
                  fontWeight: activeTemplate === i ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: activeTemplate === i ? "0 2px 8px rgba(232,121,176,0.18)" : "none",
                }}
              >
                {t.name}
              </button>
            ))}
            <button
              onClick={reset}
              style={{
                padding: "8px 14px",
                borderRadius: 20,
                border: `1.5px solid ${border}`,
                background: "transparent",
                color: textHint,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              🗑 Rensa
            </button>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {fields.map((f, idx) => {
            const accent = fieldAccents[idx];
            const isFilled = !!values[f.key]?.trim();
            return (
              <div
                key={f.key}
                style={{
                  background: cardBg,
                  border: `1.5px solid ${isFilled ? accent : border}`,
                  borderRadius: 16,
                  padding: "14px 18px",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxShadow: isFilled ? `0 2px 12px ${accent}44` : "0 1px 4px rgba(200,160,188,0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <span style={{ fontSize: 15 }}>{f.icon}</span>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: isFilled ? activeText : textHint,
                  }}>
                    {f.label}
                  </span>
                  {isFilled && (
                    <span style={{
                      marginLeft: "auto",
                      background: accent,
                      color: "#fff",
                      borderRadius: "50%",
                      width: 18,
                      height: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                    }}>✓</span>
                  )}
                </div>
                <textarea
                  value={values[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={2}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: textMain,
                    fontSize: 14,
                    lineHeight: 1.6,
                    resize: "vertical",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
                <p style={{ margin: "4px 0 0", fontSize: 12, color: textHint }}>{f.hint}</p>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ margin: "16px 0 4px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 5, background: softPink, borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${(filled / 5) * 100}%`,
              background: `linear-gradient(90deg, ${pink}, ${lavender})`,
              borderRadius: 99,
              transition: "width 0.3s ease",
            }} />
          </div>
          <span style={{ fontSize: 12, color: textHint, whiteSpace: "nowrap" }}>{filled}/5 fält</span>
        </div>

        {/* Output */}
        {prompt && (
          <div style={{
            background: "linear-gradient(135deg, #fef0f7, #f4eeff)",
            border: `1.5px solid ${border}`,
            borderRadius: 16,
            padding: "18px",
            marginTop: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: activeText, textTransform: "uppercase" }}>
                💌 Din färdiga prompt
              </span>
              <button
                onClick={copy}
                style={{
                  padding: "7px 18px",
                  borderRadius: 20,
                  border: "none",
                  background: copied
                    ? "linear-gradient(135deg, #c8f0e8, #b5d8f7)"
                    : "linear-gradient(135deg, #f9a8c9, #c4a8e8)",
                  color: copied ? "#2a8060" : "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 2px 8px rgba(200,100,160,0.2)",
                }}
              >
                {copied ? "✓ Kopierat!" : "Kopiera ✨"}
              </button>
            </div>
            <pre style={{
              margin: 0,
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: 13,
              lineHeight: 1.8,
              color: textMain,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {prompt}
            </pre>
          </div>
        )}

        {copied && (
          <div style={{
            marginTop: 12,
            padding: "12px 16px",
            background: mint,
            border: "1.5px solid #a0dfc8",
            borderRadius: 12,
          }}>
            <p style={{ margin: 0, fontSize: 13, color: "#2a7060", lineHeight: 1.5 }}>
              🌿 Klistra in prompten i en ny chatt och testa! Kom tillbaka och justera tills du är nöjd — det är vibe coding i miniformat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
