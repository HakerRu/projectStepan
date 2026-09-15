exports.up = pgm => {
    pgm.createTable('admins', {
        id: { type: 'bigserial', primaryKey: true },
        username: {
            type: 'varchar(100)',
            unique: true,
            notNull: true,
            comment: 'Логин администратора'
        },
        email: {
            type: 'varchar(255)',
            unique: true,
            comment: 'Email администратора'
        },
        passwordHash: {
            type: 'varchar(255)',
            notNull: true,
            comment: 'Хэш пароля (bcrypt)'
        },
        firstName: { type: 'varchar(100)', comment: 'Имя админа' },
        lastName: { type: 'varchar(100)', comment: 'Фамилия админа' },
        role: {
            type: 'varchar(50)',
            notNull: true,
            default: 'admin',
            comment: 'Роль: admin, manager'
        },
        isActive: {
            type: 'boolean',
            notNull: true,
            default: true,
            comment: 'Активен ли админ'
        },
        lastLogin: { type: 'timestamp with time zone', comment: 'Последний вход' },
        refreshToken: { type: 'text', comment: 'Refresh токен' },
        refreshTokenExpires: { type: 'timestamp with time zone', comment: 'Истечение refresh токена' },
        createDate: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func('now()'),
            comment: 'Дата создания'
        },
        updateDate: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func('now()'),
            comment: 'Дата обновления'
        }
    }, { ifNotExists: true, comment: 'Администраторы и менеджеры' });

    pgm.createIndex('admins', 'username', { ifNotExists: true });
    pgm.createIndex('admins', 'email', { ifNotExists: true });
    pgm.createIndex('admins', 'role', { ifNotExists: true });
};

exports.down = pgm => {
    pgm.dropTable('admins', { ifExists: true });
};