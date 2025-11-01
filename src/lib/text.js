export function stripEnglishPrefixes(s, lang) {
  if (typeof s !== "string") return s;
  let t = s.trim();

  
  if (lang !== "English") {
    const prefixes = ["Quick wins:", "Needs:", "Find them on:", "Tip:", "Note:"];
    for (const p of prefixes) {
      if (t.startsWith(p)) {
        t = t.slice(p.length).trim();
        break;
      }
    }
  }

  const replacements = {
    Dari: {
      "Quick wins": "موفقیت‌های سریع",
      "One-Week Plan": "پلان یک‌هفته‌ای",
      "Price Hint": "اشارهٔ قیمت‌گذاری",
      "Content Calendar": "تقویم محتوا",
      "Customer Persona": "پرسونای مشتری",
      "Needs": "نیازها",
      "Find them on": "کجا پیدایش کنید",
    },
    Pashto: {
      "Quick wins": "ژر بریاوې",
      "One-Week Plan": "د یوې اوونۍ پلان",
      "Price Hint": "د بیې اشاره",
      "Content Calendar": "د منځپانګې کلینډر",
      "Customer Persona": "د مشتری شخصیت",
      "Needs": "اړتیاوې",
      "Find them on": "چیرته یې پیدا کړو",
    },
  };

  const map = replacements[lang];
  if (map) {
    for (const [en, local] of Object.entries(map)) {
      const re = new RegExp(`\\b${en}\\b`, "gi");
      t = t.replace(re, local);
    }
  }

  return t;
}
