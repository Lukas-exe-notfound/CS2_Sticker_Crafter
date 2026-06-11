const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "ScrapeScope CS2 backend is running"
  });
});

// Database test route
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");

    res.json({
      success: true,
      message: "Database connection works",
      result: rows[0].result
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message
    });
  }
});

// Haal alle weapons op
app.get("/api/weapons", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, slug, category
      FROM weapons
      ORDER BY name ASC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch weapons",
      error: error.message
    });
  }
});

// Haal alle rarities op
app.get("/api/rarities", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, slug, color_hex
      FROM rarities
      ORDER BY id ASC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch rarities",
      error: error.message
    });
  }
});

// Haal alle sticker films op
app.get("/api/sticker-films", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, slug
      FROM sticker_films
      ORDER BY id ASC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sticker films",
      error: error.message
    });
  }
});

// Haal alle skins op
app.get("/api/skins", async (req, res) => {
  try {
    const search = req.query.search || "";
    const weapon = req.query.weapon || "";
    const rarity = req.query.rarity || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;
    const offset = (page - 1) * limit;

    let where = "WHERE skins.is_active = TRUE";
    const params = [];

    if (search) {
      where += " AND (skins.name LIKE ? OR skins.full_name LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (weapon) {
      where += " AND weapons.slug = ?";
      params.push(weapon);
    }

    if (rarity) {
      where += " AND rarities.slug = ?";
      params.push(rarity);
    }

    const [rows] = await pool.query(
      `
      SELECT 
        skins.id,
        skins.slug,
        skins.name,
        skins.full_name,
        skins.paint_index,
        skins.min_float,
        skins.max_float,
        skins.image_url,
        skins.colors,
        skins.supports_stattrak,
        skins.supports_souvenir,
        weapons.name AS weapon_name,
        weapons.slug AS weapon_slug,
        collections.name AS collection_name,
        rarities.name AS rarity_name,
        rarities.slug AS rarity_slug,
        rarities.color_hex AS rarity_color
      FROM skins
      JOIN weapons ON skins.weapon_id = weapons.id
      LEFT JOIN collections ON skins.collection_id = collections.id
      LEFT JOIN rarities ON skins.rarity_id = rarities.id
      ${where}
      ORDER BY skins.full_name ASC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM skins
      JOIN weapons ON skins.weapon_id = weapons.id
      LEFT JOIN rarities ON skins.rarity_id = rarities.id
      ${where}
      `,
      params
    );

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total: countRows[0].total,
        totalPages: Math.ceil(countRows[0].total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch skins",
      error: error.message
    });
  }
});

app.get("/api/skins/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        skins.id,
        skins.slug,
        skins.name,
        skins.full_name,
        skins.paint_index,
        skins.min_float,
        skins.max_float,
        skins.image_url,
        skins.colors,
        skins.supports_stattrak,
        skins.supports_souvenir,
        weapons.name AS weapon_name,
        weapons.slug AS weapon_slug,
        collections.name AS collection_name,
        rarities.name AS rarity_name,
        rarities.slug AS rarity_slug,
        rarities.color_hex AS rarity_color
      FROM skins
      JOIN weapons ON skins.weapon_id = weapons.id
      LEFT JOIN collections ON skins.collection_id = collections.id
      LEFT JOIN rarities ON skins.rarity_id = rarities.id
      WHERE skins.slug = ?
      LIMIT 1
      `,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Skin not found"
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch skin",
      error: error.message
    });
  }
});

// Haal alle stickers op
app.get("/api/stickers", async (req, res) => {
  try {
    const search = req.query.search || "";
    const film = req.query.film || "";
    const rarity = req.query.rarity || "";
    const tournament = req.query.tournament || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;
    const offset = (page - 1) * limit;

    let where = "WHERE stickers.is_active = TRUE";
    const params = [];

    if (search) {
      where += " AND (stickers.name LIKE ? OR stickers.full_name LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (film) {
      where += " AND sticker_films.slug = ?";
      params.push(film);
    }

    if (rarity) {
      where += " AND rarities.slug = ?";
      params.push(rarity);
    }

    if (tournament) {
      where += " AND tournaments.slug = ?";
      params.push(tournament);
    }

    const [rows] = await pool.query(
      `
      SELECT 
        stickers.id,
        stickers.slug,
        stickers.name,
        stickers.full_name,
        stickers.sticker_kit_id,
        stickers.image_url,
        stickers.colors,
        sticker_films.name AS film_name,
        sticker_films.slug AS film_slug,
        rarities.name AS rarity_name,
        rarities.slug AS rarity_slug,
        rarities.color_hex AS rarity_color,
        tournaments.name AS tournament_name,
        tournaments.slug AS tournament_slug,
        teams.name AS team_name,
        players.name AS player_name
      FROM stickers
      LEFT JOIN sticker_films ON stickers.film_id = sticker_films.id
      LEFT JOIN rarities ON stickers.rarity_id = rarities.id
      LEFT JOIN tournaments ON stickers.tournament_id = tournaments.id
      LEFT JOIN teams ON stickers.team_id = teams.id
      LEFT JOIN players ON stickers.player_id = players.id
      ${where}
      ORDER BY stickers.full_name ASC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM stickers
      LEFT JOIN sticker_films ON stickers.film_id = sticker_films.id
      LEFT JOIN rarities ON stickers.rarity_id = rarities.id
      LEFT JOIN tournaments ON stickers.tournament_id = tournaments.id
      ${where}
      `,
      params
    );

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total: countRows[0].total,
        totalPages: Math.ceil(countRows[0].total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stickers",
      error: error.message
    });
  }
});

app.get("/api/stickers/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        stickers.id,
        stickers.slug,
        stickers.name,
        stickers.full_name,
        stickers.sticker_kit_id,
        stickers.image_url,
        stickers.colors,
        sticker_films.name AS film_name,
        sticker_films.slug AS film_slug,
        rarities.name AS rarity_name,
        rarities.slug AS rarity_slug,
        rarities.color_hex AS rarity_color,
        tournaments.name AS tournament_name,
        tournaments.slug AS tournament_slug,
        teams.name AS team_name,
        players.name AS player_name
      FROM stickers
      LEFT JOIN sticker_films ON stickers.film_id = sticker_films.id
      LEFT JOIN rarities ON stickers.rarity_id = rarities.id
      LEFT JOIN tournaments ON stickers.tournament_id = tournaments.id
      LEFT JOIN teams ON stickers.team_id = teams.id
      LEFT JOIN players ON stickers.player_id = players.id
      WHERE stickers.slug = ?
      LIMIT 1
      `,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Sticker not found"
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sticker",
      error: error.message
    });
  }
});

// Haal alle charms op met zoeken, filters en pagination
app.get("/api/charms", async (req, res) => {
  try {
    const search = req.query.search || "";
    const rarity = req.query.rarity || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;
    const offset = (page - 1) * limit;

    let where = "WHERE charms.is_active = TRUE";
    const params = [];

    if (search) {
      where += " AND (charms.name LIKE ? OR charms.full_name LIKE ? OR charms.market_hash_name LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (rarity) {
      where += " AND rarities.slug = ?";
      params.push(rarity);
    }

    const [rows] = await pool.query(
      `
      SELECT
        charms.id,
        charms.external_id,
        charms.def_index,
        charms.slug,
        charms.name,
        charms.full_name,
        charms.market_hash_name,
        charms.description,
        charms.image_url,
        charms.colors,
        charms.collections,
        rarities.name AS rarity_name,
        rarities.slug AS rarity_slug,
        rarities.color_hex AS rarity_color
      FROM charms
      LEFT JOIN rarities ON charms.rarity_id = rarities.id
      ${where}
      ORDER BY charms.full_name ASC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM charms
      LEFT JOIN rarities ON charms.rarity_id = rarities.id
      ${where}
      `,
      params
    );

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total: countRows[0].total,
        totalPages: Math.ceil(countRows[0].total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch charms",
      error: error.message
    });
  }
});

// Haal één charm op via slug
app.get("/api/charms/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        charms.id,
        charms.external_id,
        charms.def_index,
        charms.slug,
        charms.name,
        charms.full_name,
        charms.market_hash_name,
        charms.description,
        charms.image_url,
        charms.colors,
        charms.collections,
        charms.original_data,
        rarities.name AS rarity_name,
        rarities.slug AS rarity_slug,
        rarities.color_hex AS rarity_color
      FROM charms
      LEFT JOIN rarities ON charms.rarity_id = rarities.id
      WHERE charms.slug = ?
      LIMIT 1
      `,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Charm not found"
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch charm",
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`ScrapeScope CS2 backend running on http://localhost:${PORT}`);
});