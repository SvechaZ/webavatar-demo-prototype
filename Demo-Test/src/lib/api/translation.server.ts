import { supabase } from "../supabase";

interface TranslateParams {
  text: string;
  sourceLang: string; // "auto", "th", "en", "zh"
  targetLang: string; // "th", "en", "zh"
}

export function offlineTranslate(text: string, targetLang: string): string {
  if (!text) return "";
  const target = targetLang === "zh" ? "zh" : targetLang === "th" ? "th" : "en";
  if (target === "th") return text;

  const dict: Record<string, { en: string; zh: string }> = {
    "สวัสดี, ยินดีต้อนรับ": { en: "Hello, Welcome", zh: "您好，欢迎光临" },
    "ร้านลุงเกตุ": { en: "Ran Lung Get", zh: "龙葛特餐馆" },
    "เลือกโต๊ะอาหาร": { en: "Select Dining Table", zh: "选择用餐桌号" },
    "ผังที่นั่ง": { en: "Seating Chart", zh: "座位图" },
    "เลือกโต๊ะ": { en: "Select Table", zh: "选择桌号" },
    "เปลี่ยนโต๊ะ": { en: "Change Table", zh: "更换桌号" },
    "ว่าง": { en: "Available", zh: "空闲" },
    "ไม่ว่าง": { en: "Occupied", zh: "使用中" },
    "เลือกแล้ว": { en: "Selected", zh: "已选择" },
    "ความจุ 2-4 คน": { en: "Capacity 2-4 people", zh: "可容纳 2-4 人" },
    "หน้าร้านเท่านั้น": { en: "In-store Only", zh: "仅限店内" },
    "สัญลักษณ์สถานะ:": { en: "Status Legend:", zh: "状态说明：" },
    "ทั้งหมด": { en: "All", zh: "全部" },
    "ทานที่ร้าน": { en: "Dine-in", zh: "堂食" },
    "รับกลับบ้าน": { en: "Takeaway", zh: "外带" },
    "จัดส่งถึงที่": { en: "Delivery", zh: "外送" },
    "รถเข็น": { en: "Cart", zh: "购物车" },
    "ดำเนินการสั่งซื้อ": { en: "Proceed to Checkout", zh: "去结算" },
    "ชำระเงิน": { en: "Pay Now", zh: "立即支付" },
    "ออเดอร์ใหม่": { en: "New Orders", zh: "新订单" },
    "กำลังปรุง": { en: "Cooking", zh: "正在烹饪" },
    "พร้อมเสิร์ฟ": { en: "Ready to Serve", zh: "准备就绪" },
    "สำเร็จ": { en: "Completed", zh: "已完成" },
    "ยกเลิก": { en: "Cancelled", zh: "已取消" },
    "รอดำเนินการ": { en: "Pending", zh: "等待确认" },
  };

  const clean = text.trim();
  if (dict[clean] && dict[clean][target]) return dict[clean][target];

  const terms: [string, { en: string; zh: string }][] = [
    // Meals / Categories
    ["ผัดพริกเผา", { en: "Stir-fried Sweet Chili Paste", zh: "泰式辣椒膏炒" }],
    ["ผัดพริกแกง", { en: "Stir-fried Red Curry", zh: "红咖喱炒" }],
    ["ผัดน้ำมันหอย", { en: "Stir-fried in Oyster Sauce", zh: "蚝油炒" }],
    ["ผัดผงกะหรี่", { en: "Stir-fried Curry Powder", zh: "咖喱粉炒" }],
    ["กระเทียมพริกไทย", { en: "Garlic & Pepper", zh: "蒜香胡椒" }],
    ["คั่วพริกแกง", { en: "Roasted Red Curry", zh: "干炒红咖喱" }],
    ["ผัดคะน้า", { en: "Stir-fried Chinese Broccoli with", zh: "芥兰炒" }],
    ["ผัดผักรวม", { en: "Stir-fried Mixed Vegetables", zh: "清炒什锦蔬菜" }],
    ["ผัดซีอิ๊ว", { en: "Stir-fried Soy Sauce Noodles", zh: "酱油炒粉" }],
    ["กะเพรา", { en: "Basil", zh: "罗勒" }],
    ["กระเพรา", { en: "Basil", zh: "罗勒" }],
    ["ผัดไทย", { en: "Pad Thai", zh: "泰式炒河粉" }],
    ["ต้มยำ", { en: "Tom Yum", zh: "冬阴功" }],
    ["แกงเขียวหวาน", { en: "Green Curry", zh: "绿咖喱" }],
    ["แกงเผ็ด", { en: "Red Curry", zh: "红咖喱" }],
    ["แกงส้ม", { en: "Sour Curry", zh: "酸咖喱" }],
    ["แกงจืด", { en: "Clear Soup", zh: "清汤" }],
    ["ข้าวผัด", { en: "Fried Rice", zh: "炒饭" }],
    ["ข้าวราด", { en: "over Rice", zh: "盖饭" }],
    ["ข้าว", { en: "Rice", zh: "饭" }],
    ["ก๋วยเตี๋ยว", { en: "Noodle Soup", zh: "粿条" }],
    ["บะหมี่", { en: "Egg Noodles", zh: "鸡蛋面" }],
    ["เส้นใหญ่", { en: "Wide Noodles", zh: "宽粉" }],
    ["เส้นเล็ก", { en: "Rice Noodles", zh: "细米粉" }],
    ["วุ้นเส้น", { en: "Glass Noodles", zh: "粉丝" }],
    ["มาม่า", { en: "Instant Noodles", zh: "方便面" }],
    ["ผัด", { en: "Stir-fried", zh: "炒" }],
    ["ต้ม", { en: "Boiled", zh: "煮/汤" }],
    ["ทอด", { en: "Fried", zh: "炸" }],
    ["ย่าง", { en: "Grilled", zh: "烤" }],
    ["อบ", { en: "Baked", zh: "焗" }],
    ["นึ่ง", { en: "Steamed", zh: "蒸" }],
    ["คั่ว", { en: "Roasted", zh: "干炒" }],
    ["ยำ", { en: "Spicy Salad", zh: "凉拌" }],
    ["ลาบ", { en: "Spicy Minced Salad", zh: "泰式肉碎沙拉" }],
    ["ส้มตำ", { en: "Som Tum", zh: "青木瓜沙拉" }],
    ["กระเทียม", { en: "Garlic", zh: "蒜香" }],

    // Ingredients & Proteins
    ["หมูกรอบ", { en: "Crispy Pork", zh: "脆皮五花肉" }],
    ["หมูสับ", { en: "Minced Pork", zh: "猪肉碎" }],
    ["หมูชิ้น", { en: "Sliced Pork", zh: "猪肉片" }],
    ["หมู", { en: "Pork", zh: "猪肉" }],
    ["ไก่สับ", { en: "Minced Chicken", zh: "鸡肉碎" }],
    ["ไก่ต้ม", { en: "Boiled Chicken", zh: "白斩鸡" }],
    ["ไก่", { en: "Chicken", zh: "鸡肉" }],
    ["เนื้อวัว", { en: "Beef", zh: "牛肉" }],
    ["เนื้อ", { en: "Beef", zh: "牛肉" }],
    ["กุ้งสด", { en: "Fresh Shrimp", zh: "鲜虾" }],
    ["กุ้ง", { en: "Shrimp", zh: "鲜虾" }],
    ["ปลาหมึก", { en: "Squid", zh: "鱿鱼" }],
    ["หมึก", { en: "Squid", zh: "鱿鱼" }],
    ["หอยลาย", { en: "Clams", zh: "蛤蜊" }],
    ["หอย", { en: "Clams", zh: "贝类" }],
    ["ปู", { en: "Crab", zh: "蟹肉" }],
    ["ปลา", { en: "Fish", zh: "鱼肉" }],
    ["ทะเล", { en: "Seafood", zh: "海鲜" }],
    ["ไข่ดาว", { en: "Fried Egg", zh: "煎蛋" }],
    ["ไข่เจียว", { en: "Omelette", zh: "煎蛋饼" }],
    ["ไข่ต้ม", { en: "Boiled Egg", zh: "煮鸡蛋" }],
    ["ไข่", { en: "Egg", zh: "鸡蛋" }],
    ["คะน้า", { en: "Chinese Broccoli", zh: "芥兰" }],
    ["ผัก", { en: "Vegetables", zh: "蔬菜" }],

    // Drinks & Desserts
    ["น้ำส้มคั้น", { en: "Orange Juice", zh: "鲜榨橙汁" }],
    ["น้ำส้ม", { en: "Orange Juice", zh: "鲜榨橙汁" }],
    ["น้ำลำไย", { en: "Longan Juice", zh: "龙眼水" }],
    ["น้ำเปล่า", { en: "Drinking Water", zh: "矿泉水" }],
    ["โค้ก", { en: "Coke", zh: "可乐" }],
    ["ชาไทย", { en: "Thai Milk Tea", zh: "泰式奶茶" }],
    ["ชาเย็น", { en: "Thai Iced Tea", zh: "泰式冰茶" }],
    ["ชาเขียว", { en: "Green Tea", zh: "绿茶" }],
    ["กาแฟ", { en: "Coffee", zh: "咖啡" }],
    ["เฉาก๊วย", { en: "Grass Jelly", zh: "仙草冻" }],
    ["น้ำแข็งไส", { en: "Shaved Ice", zh: "刨冰" }],
    ["ข้าวเหนียวมะม่วง", { en: "Mango Sticky Rice", zh: "芒果糯米饭" }],
  ];

  let out = clean;
  let translatedAny = false;
  for (const [k, v] of terms) {
    if (out.includes(k) && v[target]) {
      out = out.replaceAll(k, v[target] + " ");
      translatedAny = true;
    }
  }

  if (translatedAny) {
    return out.replace(/\s+/g, " ").trim();
  }

  return clean;
}

export async function translateText({ text, sourceLang, targetLang }: TranslateParams) {
  const src = sourceLang === "auto" ? "" : sourceLang;
  
  // 1. Check cache first
  const cacheSourceLang = sourceLang === "auto" ? "auto" : sourceLang;
  const { data: cached, error: cacheErr } = await supabase
    .from("translation_cache")
    .select("translated_text")
    .eq("source_text", text)
    .eq("source_lang", cacheSourceLang)
    .eq("target_lang", targetLang)
    .maybeSingle();

  if (!cacheErr && cached) {
    console.log("Translation cache hit!");
    return { translatedText: cached.translated_text, cached: true };
  }

  let translatedText = "";
  let detectedSourceLang = sourceLang;

  // 2. Try Google Translate API first
  const googleApiKey = process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_API_KEY;
  let googleSuccess = false;

  if (googleApiKey) {
    try {
      console.log("Calling Google Translate API...");
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: src || undefined,
            target: targetLang,
            format: "text",
          }),
        }
      );

      if (response.ok) {
        const resJson = await response.json();
        const translation = resJson?.data?.translations?.[0];
        if (translation) {
          translatedText = translation.translatedText;
          if (sourceLang === "auto" && translation.detectedSourceLanguage) {
            detectedSourceLang = translation.detectedSourceLanguage;
          }
          googleSuccess = true;
          console.log("Google Translate API success!");
        }
      } else {
        const errText = await response.text();
        console.error("Google Translate API error response:", errText);
      }
    } catch (e) {
      console.error("Google Translate API exception:", e);
    }
  } else {
    console.log("Google Translate API key not found. Skipping to fallback...");
  }

  // 3. Fallback to OpenAI API if Google Translate failed or was not configured
  if (!googleSuccess) {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.warn("Both Google Translate API Key and OpenAI API Key are missing. Using offline translation dictionary as fallback.");
      translatedText = offlineTranslate(text, targetLang);
    } else {
      try {
        console.log("Calling OpenAI API fallback (gpt-4o-mini)...");
        const systemPrompt = `You are a professional translator. Translate the user's text into ${
          targetLang === "th" ? "Thai" : targetLang === "zh" ? "Chinese (Simplified)" : "English"
        }.
${
  sourceLang !== "auto"
    ? `The source language is ${
        sourceLang === "th" ? "Thai" : sourceLang === "zh" ? "Chinese" : "English"
      }.`
    : "Detect the source language automatically."
}
Only output the exact translated text without any explanations, notes, or extra characters.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: text },
            ],
            temperature: 0.3,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error(`OpenAI API failed: ${errText}`);
          translatedText = offlineTranslate(text, targetLang);
        } else {
          const resJson = await response.json();
          translatedText = resJson?.choices?.[0]?.message?.content?.trim() || offlineTranslate(text, targetLang);
          console.log("OpenAI API success!");
        }
      } catch (e: any) {
        console.error("OpenAI API exception:", e);
        translatedText = offlineTranslate(text, targetLang);
      }
    }
  }

  // 4. Save to cache in Supabase
  if (translatedText) {
    try {
      await supabase.from("translation_cache").insert({
        source_text: text,
        source_lang: cacheSourceLang,
        target_lang: targetLang,
        translated_text: translatedText,
      });
      console.log("Saved to translation cache.");
    } catch (e) {
      console.warn("Failed to write to translation cache:", e);
    }
  }

  return { translatedText, cached: false };
}
