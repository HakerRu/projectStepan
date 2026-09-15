const crypto = require('crypto');

exports.up = pgm => {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'MetalPro2024!';
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    pgm.sql(`
        INSERT INTO admins (username, "passwordHash", role, "isActive")
        VALUES ('${username}', '${passwordHash}', 'admin', true)
        ON CONFLICT (username) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash"
    `);
};

exports.down = pgm => {
    pgm.sql(`DELETE FROM admins WHERE username = 'admin'`);
};