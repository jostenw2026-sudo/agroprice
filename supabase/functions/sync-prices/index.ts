import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// ============================================
// CONFIGURATION
// ============================================

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// VOLATILITÉ PAR CATÉGORIE
// ============================================

const PRICE_VOLATILITY: Record<string, [number, number]> = {
  "Cacao": [0.03, 0.05],
  "Banane": [0.02, 0.04],
  "Café": [0.04, 0.06],
  "Légumes": [0.04, 0.06],
  "Huiles": [0.05, 0.08],
  "Condiments": [0.06, 0.09],
  "Noix": [0.03, 0.05],
  "Fruits": [0.03, 0.05],
};

// ============================================
// HELPERS
// ============================================

function getVolatility(category: string): [number, number] {
  return PRICE_VOLATILITY[category] || [0.03, 0.05];
}

function randomVariation(volatilityRange: [number, number]): number {
  const [min, max] = volatilityRange;
  const randomPercent = Math.random() * (max - min) + min;
  const direction = Math.random() > 0.5 ? 1 : -1;
  return 1 + direction * randomPercent;
}

function convertPrices(priceFcfa: number) {
  return {
    price_fcfa: priceFcfa,
    price_cny: Math.round(priceFcfa / 85),
    price_usd: Math.round(priceFcfa / 615),
  };
}

function successResponse(data: unknown) {
  return new Response(
    JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      data,
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
}

function errorResponse(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { "Content-Type": "application/json" },
      status,
    }
  );
}

// ============================================
// FONCTION PRINCIPALE
// ============================================

serve(async (req) => {
  console.log(`[SYNC-PRICES] Début à ${new Date().toISOString()}`);

  try {
    // Récupérer tous les produits actifs
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name_fr, category")
      .eq("is_active", true);

    if (productsError) {
      console.error("[SYNC-PRICES] Erreur récupération produits:", productsError);
      return errorResponse(`Erreur produits: ${productsError.message}`);
    }

    if (!products || products.length === 0) {
      console.log("[SYNC-PRICES] Aucun produit à synchroniser");
      return successResponse({ message: "No products to sync", count: 0 });
    }

    console.log(`[SYNC-PRICES] ${products.length} produits trouvés`);

    // Récupérer toutes les sources
    const { data: sources, error: sourcesError } = await supabase
      .from("sources")
      .select("id, name, region");

    if (sourcesError) {
      console.error("[SYNC-PRICES] Erreur récupération sources:", sourcesError);
      return errorResponse(`Erreur sources: ${sourcesError.message}`);
    }

    if (!sources || sources.length === 0) {
      console.log("[SYNC-PRICES] Aucune source trouvée");
      return successResponse({ message: "No sources found", count: 0 });
    }

    console.log(`[SYNC-PRICES] ${sources.length} sources trouvées`);

    // Récupérer les derniers prix
    const { data: lastPrices, error: lastPricesError } = await supabase
      .from("price_records")
      .select("product_id, source_id, price_fcfa")
      .order("recorded_at", { ascending: false })
      .limit(sources.length! * products.length!);

    if (lastPricesError) {
      console.error("[SYNC-PRICES] Erreur récupération derniers prix:", lastPricesError);
    }

    const lastPriceMap = new Map<string, number>();
    if (lastPrices && lastPrices.length > 0) {
      lastPrices.forEach(record => {
        const key = `${record.product_id}-${record.source_id}`;
        if (!lastPriceMap.has(key)) {
          lastPriceMap.set(key, record.price_fcfa);
        }
      });
    }

    console.log(`[SYNC-PRICES] Map de derniers prix: ${lastPriceMap.size} entrées`);

    // ============================================
    // GÉNÉRER NOUVEAUX PRIX
    // ============================================

    const newRecords: unknown[] = [];
    const now = new Date().toISOString();

    for (const product of products) {
      const volatility = getVolatility(product.category);

      for (const source of sources) {
        const key = `${product.id}-${source.id}`;
        const lastPrice = lastPriceMap.get(key) || 500000;
        const variation = randomVariation(volatility);
        const newPriceFcfa = Math.max(Math.round(lastPrice * variation), 1000);

        const record = {
          product_id: product.id,
          source_id: source.id,
          ...convertPrices(newPriceFcfa),
          product_form: "fresh",
          quality_grade: "standard",
          recorded_at: now,
        };

        newRecords.push(record);
      }
    }

    console.log(`[SYNC-PRICES] ${newRecords.length} nouveaux prix générés`);

    // ============================================
    // INSÉRER LES NOUVEAUX PRIX
    // ============================================

    const { data: insertedData, error: insertError } = await supabase
      .from("price_records")
      .insert(newRecords as any);

    if (insertError) {
      console.error("[SYNC-PRICES] Erreur insertion prix:", insertError);
      return errorResponse(`Erreur insertion: ${insertError.message}`);
    }

    console.log(`[SYNC-PRICES] Insertion réussie`);

    // ============================================
    // VÉRIFIER LES ALERTES
    // ============================================

    const { data: alerts, error: alertsError } = await supabase
      .from("alerts")
      .select("id, product_id, target_price_fcfa, alert_type, is_active")
      .eq("is_active", true);

    if (alertsError) {
      console.error("[SYNC-PRICES] Erreur récupération alertes:", alertsError);
    }

    let triggeredAlerts = 0;

    if (alerts && alerts.length > 0) {
      for (const alert of alerts) {
        const productPrices = (newRecords as any[])
          .filter(r => r.product_id === alert.product_id)
          .map(r => r.price_fcfa);

        if (productPrices.length === 0) continue;

        const minPrice = Math.min(...productPrices);

        const triggered =
          (alert.alert_type === "above" && minPrice >= alert.target_price_fcfa) ||
          (alert.alert_type === "below" && minPrice <= alert.target_price_fcfa);

        if (triggered) {
          triggeredAlerts++;
          console.log(`[SYNC-PRICES] Alerte déclenchée: ${alert.id} (${alert.alert_type})`);
        }
      }
    }

    console.log(`[SYNC-PRICES] ${triggeredAlerts} alerte(s) déclenchée(s)`);

    // ============================================
    // RÉPONSE FINALE
    // ============================================

    const summary = {
      productsCount: products.length,
      sourcesCount: sources.length,
      pricesInserted: newRecords.length,
      alertsTriggered: triggeredAlerts,
      timestamp: now,
    };

    console.log("[SYNC-PRICES] Succès:", JSON.stringify(summary));

    return successResponse(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[SYNC-PRICES] Erreur non gérée:", message);
    return errorResponse(`Erreur serveur: ${message}`, 500);
  }
});
