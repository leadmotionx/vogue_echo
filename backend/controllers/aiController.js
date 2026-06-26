const { GoogleGenerativeAI } = require("@google/generative-ai");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const collectionModel = require("../models/collectionModel");
const fs = require("fs");

// Lazy initialization — ensures dotenv has loaded before we read the key
let genAI = null;
const getGenAI = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

// Helper: Get all active products as context string
const getProductCatalog = async () => {
  const products = await productModel.find({ isDeleted: false });
  return products.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    description: p.description,
    price: p.price,
    discount: p.discount,
    discountedPrice: Math.round(p.price - (p.price * p.discount) / 100),
    category: p.category,
    subCategory: p.subCategory,
    collection: p.collection,
    sizes: p.sizes,
    bestseller: p.bestseller,
    isNewArrival: p.isNewArrival,
    images: p.image,
  }));
};

// Helper: Get collections
const getCollections = async () => {
  const collections = await collectionModel.find({ isDeleted: false });
  return collections.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    description: c.description,
  }));
};

// ============ 1. AI CHATBOT ============
const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.json({ success: false, message: "Message is required" });
    }

    const products = await getProductCatalog();
    const collections = await getCollections();

    const systemPrompt = `You are "Vogue Echo AI" — a premium, knowledgeable, and elegant customer service assistant for the luxury fashion store "Vogue Echo". 

STORE INFO:
- Currency: PKR (Rs.)
- Delivery Fee: Rs.250 flat
- Payment: Cash on Delivery (COD)
- Store specializes in premium, elegant fashion
- Website: vogueecho.com

PRODUCT CATALOG (${products.length} items):
${JSON.stringify(products, null, 1)}

COLLECTIONS:
${JSON.stringify(collections, null, 1)}

RULES:
1. ALWAYS respond in English — professional, warm, and polished like a luxury fashion consultant
2. When recommending products, you MUST use this exact format for each product:
   [[PRODUCT:productId:Product Name]]
   Example: Check out our [[PRODUCT:abc123:Sculpted Wool Blazer]] — perfect for formal occasions!
3. Always mention the discounted price (Rs.X) and available sizes alongside the product link
4. If asked about availability, check the sizes array for that product
5. If asked about order tracking, ask for their Order ID (format: VE-XXXXXX) and guide them to use the Track Order page on the website
6. NEVER make up products that don't exist in the catalog. Only reference real products with their real IDs
7. For occasion-based queries (wedding, party, casual, summer, winter etc.), analyze product descriptions, categories, names and styles to find the best matches
8. Keep responses concise but helpful — 2-3 sentences intro + product list with links
9. Suggest outfit combinations when appropriate (e.g., pair a blazer with matching trousers)
10. If asked something outside your scope (returns policy, shipping time etc.), provide helpful general info
11. Use emojis sparingly and professionally ✨
12. Format product recommendations as a clean list with bullet points
13. The product ID is the "id" field from the catalog — use it exactly as provided`;

    const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build conversation history for context
    const chatHistory = (history || []).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Understood! I'm Vogue Echo AI, ready to help customers with product recommendations, sizing, collections, and order queries. I have the full catalog loaded. How can I help? 😊",
            },
          ],
        },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    res.json({ success: true, response });
  } catch (error) {
    console.log("Chat AI Error:", error);
    res.json({
      success: false,
      message: "AI service temporarily unavailable",
    });
  }
};

// ============ 2. SEMANTIC SEARCH ============
const semanticSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.json({ success: false, message: "Search query is required" });
    }

    const products = await getProductCatalog();

    const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a fashion product search engine. A customer is searching for: "${query}"

Here is the product catalog:
${JSON.stringify(products, null, 1)}

TASK: Analyze the customer's search intent and return the IDs of products that match their query, ranked by relevance (most relevant first).

Consider:
- Direct keyword matches
- Semantic meaning (e.g., "wedding outfit" should match formal/elegant items, "beach wear" should match casual/light items)
- Category and subcategory relevance
- Occasion matching based on product descriptions
- Style and aesthetic matching

IMPORTANT: Return ONLY a valid JSON array of product IDs, nothing else. Example: ["id1", "id2", "id3"]
If no products match at all, return an empty array: []`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Parse the JSON array from Gemini's response
    let matchedIds = [];
    try {
      // Extract JSON array from response (handle markdown code blocks)
      const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        matchedIds = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.log("Parse error:", parseError);
      matchedIds = [];
    }

    // Fetch full product data for matched IDs, maintaining order
    const allProducts = await productModel.find({ isDeleted: false });
    const matchedProducts = matchedIds
      .map((id) => allProducts.find((p) => p._id.toString() === id))
      .filter(Boolean);

    res.json({
      success: true,
      products: matchedProducts,
      query: query,
      totalMatches: matchedProducts.length,
    });
  } catch (error) {
    console.log("Semantic Search Error:", error);
    res.json({
      success: false,
      message: "AI search temporarily unavailable",
    });
  }
};

// ============ 3. IMAGE SEARCH (MULTIMODAL) ============
const imageSearch = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "Image is required" });
    }

    const products = await getProductCatalog();

    // Read uploaded image as base64
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");
    const mimeType = req.file.mimetype || "image/jpeg";

    // Clean up temp file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a visual fashion matching AI for the store "Vogue Echo".

The customer has uploaded an image. Analyze this image carefully — identify the type of clothing, colors, patterns, style, fabric texture, and overall aesthetic.

Here is the product catalog with image URLs:
${JSON.stringify(products, null, 1)}

TASK: Match the uploaded image to products in the catalog based on:
1. Visual similarity (color, pattern, style)
2. Same type of clothing (shirt, pants, dress, etc.)
3. Same aesthetic/occasion (casual, formal, wedding, party, etc.)
4. Complementary items that would go well with the uploaded item

Return ONLY a valid JSON array of matching product IDs ranked by relevance (most visually similar first). Example: ["id1", "id2", "id3"]
If nothing matches, return: []`;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
    ]);

    const responseText = result.response.text().trim();

    let matchedIds = [];
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        matchedIds = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.log("Image search parse error:", parseError);
      matchedIds = [];
    }

    // Fetch full product data for matched IDs
    const allProducts = await productModel.find({ isDeleted: false });
    const matchedProducts = matchedIds
      .map((id) => allProducts.find((p) => p._id.toString() === id))
      .filter(Boolean);

    res.json({
      success: true,
      products: matchedProducts,
      totalMatches: matchedProducts.length,
    });
  } catch (error) {
    console.log("Image Search Error:", error);
    res.json({
      success: false,
      message: "AI image search temporarily unavailable",
    });
  }
};

module.exports = {
  chatWithAI,
  semanticSearch,
  imageSearch,
};
