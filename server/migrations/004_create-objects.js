exports.up = pgm => {
    pgm.createTable('objects', {
        id: { type: 'bigserial', primaryKey: true },
        title: { type: 'varchar(255)', notNull: true, comment: 'Название объекта' },
        location: { type: 'varchar(255)', comment: 'Локация (город, область)' },
        area: { type: 'varchar(50)', comment: 'Площадь объекта (м²)' },
        description: { type: 'text', comment: 'Описание проекта' },
        materials: { type: 'text', comment: 'Использованные материалы (JSON)' },
        deliveryTime: { type: 'varchar(50)', comment: 'Срок поставки' },
        installTime: { type: 'varchar(50)', comment: 'Срок монтажа' },
        year: { type: 'integer', comment: 'Год завершения' },
        imageUrl: { type: 'varchar(500)', comment: 'URL фото объекта' },
        isActive: {
            type: 'boolean',
            notNull: true,
            default: true,
            comment: 'Показывать ли объект'
        },
        sortOrder: { type: 'integer', default: 0, comment: 'Порядок сортировки' },
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
    }, { ifNotExists: true, comment: 'Примеры реализованных объектов' });

    pgm.createIndex('objects', 'isActive', { ifNotExists: true });
    pgm.createIndex('objects', 'year', { ifNotExists: true });
};

exports.down = pgm => {
    pgm.dropTable('objects', { ifExists: true });
};