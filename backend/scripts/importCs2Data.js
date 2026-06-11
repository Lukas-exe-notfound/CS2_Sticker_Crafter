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

function getColors(item) {
  if (item.rarity && item.rarity.color) {
    return JSON.stringify([item.rarity.color]);
  }

  return JSON.stringify([]);
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

async function getOrCreateWeapon(weaponName) {
  if (!weaponName) {
    return null;
  }

  const slug = slugify(weaponName);

  const [existing] = await pool.query(
    "SELECT id FROM weapons WHERE slug = ? LIMIT 1",
    [slug]
  );

  if (existing.length > 0) {
    return existing[0].id;
  }

  const [result] = await pool.query(
    "INSERT INTO weapons (name, slug, category) VALUES (?, ?, ?)",
    [weaponName, slug, "Unknown"]
  );

  return result.insertId;
}

async function getOrCreateCollection(collection) {
  if (!collection || !collection.name) {
    return null;
  }

  const slug = slugify(collection.name);

  const [existing] = await pool.query(
    "SELECT id FROM collections WHERE slug = ? LIMIT 1",
    [slug]
  );

  if (existing.length > 0) {
    return existing[0].id;
  }

  const [result] = await pool.query(
    "INSERT INTO collections (name, slug, image_url) VALUES (?, ?, ?)",
    [collection.name, slug, collection.image || null]
  );

  return result.insertId;
}

async function getOrCreateStickerFilm(filmName) {
  const cleanFilmName = filmName || "Other";
  const slug = slugify(cleanFilmName);

  const [existing] = await pool.query(
    "SELECT id FROM sticker_films WHERE slug = ? LIMIT 1",
    [slug]
  );

  if (existing.length > 0) {
    return existing[0].id;
  }

  const [result] = await pool.query(
    "INSERT INTO sticker_films (name, slug) VALUES (?, ?)",
    [cleanFilmName, slug]
  );

  return result.insertId;
}

async function getOrCreateTournament(name) {
  if (!name) {
    return null;
  }

  const slug = slugify(name);

  const [existing] = await pool.query(
    "SELECT id FROM tournaments WHERE slug = ? LIMIT 1",
    [slug]
  );

  if (existing.length > 0) {
    return existing[0].id;
  }

  const yearMatch = name.match(/\b(20\d{2})\b/);
  const year = yearMatch ? Number(yearMatch[1]) : null;

  const [result] = await pool.query(
    "INSERT INTO tournaments (name, slug, year) VALUES (?, ?, ?)",
    [name, slug, year]
  );

  return result.insertId;
}

async function getOrCreateTeam(name) {
  if (!name) {
    return null;
  }

  const slug = slugify(name);

  const [existing] = await pool.query(
    "SELECT id FROM teams WHERE slug = ? LIMIT 1",
    [slug]
  );

  if (existing.length > 0) {
    return existing[0].id;
  }

  const [result] = await pool.query(
    "INSERT INTO teams (name, slug) VALUES (?, ?)",
    [name, slug]
  );

  return result.insertId;
}

function detectFilmType(stickerName) {
  const name = String(stickerName || "").toLowerCase();

  if (name.includes("gold")) return "Gold";
  if (name.includes("holo")) return "Holo";
  if (name.includes("foil")) return "Foil";
  if (name.includes("glitter")) return "Glitter";
  if (name.includes("lenticular")) return "Lenticular";

  return "Paper";
}

function detectTournament(stickerName) {
  const name = String(stickerName || "");

  const knownEvents = [
    "Cologne",
    "Katowice",
    "Paris",
    "Antwerp",
    "Stockholm",
    "Rio",
    "Copenhagen",
    "Shanghai",
    "Berlin",
    "Boston",
    "Krakow",
    "Atlanta",
    "London",
    "Cluj-Napoca",
    "DreamHack"
  ];

  const found = knownEvents.find((event) =>
    name.toLowerCase().includes(event.toLowerCase())
  );

  if (!found) {
    return null;
  }

  const yearMatch = name.match(/\b(20\d{2})\b/);
  return yearMatch ? `${found} ${yearMatch[1]}` : found;
}

async function importSkins() {
  console.log("Fetching skins...");

  const response = await axios.get(`${API_BASE}/skins.json`);
  const skins = response.data;

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const skin of skins) {
    try {
      const weaponName =
        skin.weapon && skin.weapon.name
          ? skin.weapon.name
          : skin.name && skin.name.includes("|")
          ? skin.name.split("|")[0].trim()
          : null;

      if (!weaponName) {
        failed++;
        continue;
      }

      const weaponId = await getOrCreateWeapon(weaponName);
      const rarityId = await getOrCreateRarity(skin.rarity);
      const collectionId =
        skin.collections && skin.collections.length > 0
          ? await getOrCreateCollection(skin.collections[0])
          : null;

      const fullName = skin.name;
      const name = skin.pattern ? skin.pattern.name : skin.name;
      const slug = slugify(fullName);
      const paintIndex = skin.paint_index || null;

      const minFloat =
        skin.min_float !== undefined && skin.min_float !== null
          ? skin.min_float
          : 0;

      const maxFloat =
        skin.max_float !== undefined && skin.max_float !== null
          ? skin.max_float
          : 1;

      const imageUrl = skin.image || null;
      const colors = getColors(skin);

      const [existing] = await pool.query(
        "SELECT id FROM skins WHERE slug = ? LIMIT 1",
        [slug]
      );

      if (existing.length > 0) {
        await pool.query(
          `
          UPDATE skins
          SET 
            external_id = ?,
            weapon_id = ?,
            collection_id = ?,
            rarity_id = ?,
            name = ?,
            full_name = ?,
            paint_index = ?,
            min_float = ?,
            max_float = ?,
            image_url = ?,
            colors = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
          `,
          [
            skin.id || null,
            weaponId,
            collectionId,
            rarityId,
            name,
            fullName,
            paintIndex,
            minFloat,
            maxFloat,
            imageUrl,
            colors,
            existing[0].id
          ]
        );

        updated++;
      } else {
        await pool.query(
          `
          INSERT INTO skins (
            external_id,
            slug,
            weapon_id,
            collection_id,
            rarity_id,
            name,
            full_name,
            paint_index,
            min_float,
            max_float,
            image_url,
            colors
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            skin.id || null,
            slug,
            weaponId,
            collectionId,
            rarityId,
            name,
            fullName,
            paintIndex,
            minFloat,
            maxFloat,
            imageUrl,
            colors
          ]
        );

        created++;
      }
    } catch (error) {
      failed++;
      console.error("Skin import failed:", skin.name, error.message);
    }
  }

  console.log(`Skins imported. Created: ${created}, Updated: ${updated}, Failed: ${failed}`);

  return { created, updated, failed };
}

async function importStickers() {
  console.log("Fetching stickers...");

  const response = await axios.get(`${API_BASE}/stickers.json`);
  const stickers = response.data;

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const sticker of stickers) {
    try {
      if (!sticker.name) {
        failed++;
        continue;
      }

      const fullName = sticker.name;
      const name = sticker.name;
      const slug = slugify(fullName);

      const filmName =
        sticker.type && sticker.type.name
          ? sticker.type.name
          : detectFilmType(sticker.name);

      const filmId = await getOrCreateStickerFilm(filmName);
      const rarityId = await getOrCreateRarity(sticker.rarity);

      const tournamentName = detectTournament(sticker.name);
      const tournamentId = tournamentName
        ? await getOrCreateTournament(tournamentName)
        : null;

      const teamId =
        sticker.tournament_event && sticker.tournament_event.length > 0
          ? null
          : null;

      const imageUrl = sticker.image || null;
      const colors = getColors(sticker);

      const stickerKitId =
        sticker.id && String(sticker.id).match(/\d+/)
          ? Number(String(sticker.id).match(/\d+/)[0])
          : null;

      const [existing] = await pool.query(
        "SELECT id FROM stickers WHERE slug = ? LIMIT 1",
        [slug]
      );

      if (existing.length > 0) {
        await pool.query(
          `
          UPDATE stickers
          SET 
            external_id = ?,
            sticker_kit_id = ?,
            name = ?,
            full_name = ?,
            film_id = ?,
            rarity_id = ?,
            tournament_id = ?,
            team_id = ?,
            image_url = ?,
            colors = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
          `,
          [
            sticker.id || null,
            stickerKitId,
            name,
            fullName,
            filmId,
            rarityId,
            tournamentId,
            teamId,
            imageUrl,
            colors,
            existing[0].id
          ]
        );

        updated++;
      } else {
        await pool.query(
          `
          INSERT INTO stickers (
            external_id,
            sticker_kit_id,
            slug,
            name,
            full_name,
            film_id,
            rarity_id,
            tournament_id,
            team_id,
            image_url,
            colors
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            sticker.id || null,
            stickerKitId,
            slug,
            name,
            fullName,
            filmId,
            rarityId,
            tournamentId,
            teamId,
            imageUrl,
            colors
          ]
        );

        created++;
      }
    } catch (error) {
      failed++;
      console.error("Sticker import failed:", sticker.name, error.message);
    }
  }

  console.log(`Stickers imported. Created: ${created}, Updated: ${updated}, Failed: ${failed}`);

  return { created, updated, failed };
}

async function logImport(sourceName, importType, status, result, message = null) {
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
      sourceName,
      importType,
      status,
      result.created || 0,
      result.updated || 0,
      result.failed || 0,
      message
    ]
  );
}

async function main() {
  console.log("Starting CS2 data import...");

  try {
    const skinResult = await importSkins();
    await logImport("ByMykel CSGO-API", "skins", "success", skinResult);

    const stickerResult = await importStickers();
    await logImport("ByMykel CSGO-API", "stickers", "success", stickerResult);

    console.log("Import finished successfully.");
  } catch (error) {
    console.error("Import failed:", error.message);

    await logImport(
      "ByMykel CSGO-API",
      "full_import",
      "failed",
      { created: 0, updated: 0, failed: 1 },
      error.message
    );
  } finally {
    await pool.end();
  }
}

main();