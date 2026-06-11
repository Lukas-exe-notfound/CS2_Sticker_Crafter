require("dotenv").config();

const axios = require("axios");
const pool = require("../db");

const API_BASE = "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\|/g, "")
    .replace(/★/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function getOrCreateRarity(rarity) {
  if (!rarity || !rarity.name) {
    return null;
  }

  const slug = slugify(rarity.name);
  const color = rarity.color || null;

  const [existing] = await pool.query(
    "SELECT id FROM rarities WHERE slug = ? LIMIT 1",
    [slug]
  );

  if (existing.length > 0) {
    return existing[0].id;
  }

  const [result] = await pool.query(
    "INSERT INTO rarities (name, slug, color_hex) VALUES (?, ?, ?)",
    [rarity.name, slug, color]
  );

  return result.insertId;
}

function parseDefIndex(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? null : numberValue;
}

async function importCharms() {
  console.log("Fetching charms/keychains...");

  const response = await axios.get(`${API_BASE}/keychains.json`);
  const charms = response.data;

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const charm of charms) {
    try {
      if (!charm.name) {
        failed++;
        continue;
      }

      const externalId = charm.id || null;
      const defIndex = parseDefIndex(charm.def_index);
      const name = charm.name;
      const fullName = charm.market_hash_name || charm.name;
      const slug = slugify(fullName);

      const rarityId = await getOrCreateRarity(charm.rarity);

      const description = charm.description || null;
      const marketHashName = charm.market_hash_name || null;
      const imageUrl = charm.image || null;

      const collections = charm.collections
        ? JSON.stringify(charm.collections)
        : JSON.stringify([]);

      const originalData = charm.original
        ? JSON.stringify(charm.original)
        : JSON.stringify(charm);

      const colors =
        charm.rarity && charm.rarity.color
          ? JSON.stringify([charm.rarity.color])
          : JSON.stringify([]);

      const [existing] = await pool.query(
        "SELECT id FROM charms WHERE slug = ? LIMIT 1",
        [slug]
      );

      if (existing.length > 0) {
        await pool.query(
          `
          UPDATE charms
          SET
            external_id = ?,
            def_index = ?,
            name = ?,
            full_name = ?,
            market_hash_name = ?,
            description = ?,
            rarity_id = ?,
            image_url = ?,
            colors = ?,
            collections = ?,
            original_data = ?,
            is_active = TRUE,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
          `,
          [
            externalId,
            defIndex,
            name,
            fullName,
            marketHashName,
            description,
            rarityId,
            imageUrl,
            colors,
            collections,
            originalData,
            existing[0].id
          ]
        );

        updated++;
      } else {
        await pool.query(
          `
          INSERT INTO charms (
            external_id,
            def_index,
            slug,
            name,
            full_name,
            market_hash_name,
            description,
            rarity_id,
            image_url,
            colors,
            collections,
            original_data
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            externalId,
            defIndex,
            slug,
            name,
            fullName,
            marketHashName,
            description,
            rarityId,
            imageUrl,
            colors,
            collections,
            originalData
          ]
        );

        created++;
      }
    } catch (error) {
      failed++;
      console.error("Charm import failed:", charm.name, error.message);
    }
  }

  await pool.query(
    `
    INSERT INTO data_import_logs (
      source_name,
      import_type,
      status,
      records_created,
      records_updated,
      records_failed,
      message,
      finished_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `,
    [
      "ByMykel CSGO-API",
      "charms/keychains",
      failed === 0 ? "success" : "partial",
      created,
      updated,
      failed,
      `Imported charms/keychains from ${API_BASE}/keychains.json`
    ]
  );

  console.log(`Charms imported. Created: ${created}, Updated: ${updated}, Failed: ${failed}`);
}

async function main() {
  try {
    await importCharms();
  } catch (error) {
    console.error("Import failed:", error.message);

    await pool.query(
      `
      INSERT INTO data_import_logs (
        source_name,
        import_type,
        status,
        records_created,
        records_updated,
        records_failed,
        message,
        finished_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      [
        "ByMykel CSGO-API",
        "charms/keychains",
        "failed",
        0,
        0,
        1,
        error.message
      ]
    );
  } finally {
    await pool.end();
  }
}

main();