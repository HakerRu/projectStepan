exports.up = pgm => {
    pgm.createTable('leads', {
        id: { type: 'bigserial', primaryKey: true },
        type: {
            type: 'varchar(50)',
            notNull: true,
            comment: 'Тип заявки: callback, contact, quick_calc, order'
        },
        name: { type: 'varchar(255)', comment: 'Имя клиента' },
        company: { type: 'varchar(255)', comment: 'Компания клиента' },
        phone: { type: 'varchar(20)', notNull: true, comment: 'Телефон' },
        email: { type: 'varchar(255)', comment: 'Email' },
        product: { type: 'varchar(255)', comment: 'Название продукта' },
        productType: { type: 'varchar(100)', comment: 'Тип продукции: sandwich, proflist' },
        quantity: { type: 'varchar(50)', comment: 'Количество' },
        area: { type: 'varchar(50)', comment: 'Площадь (м²)' },
        message: { type: 'text', comment: 'Сообщение клиента' },
        comment: { type: 'text', comment: 'Комментарий' },
        status: {
            type: 'varchar(20)',
            notNull: true,
            default: 'new',
            comment: 'Статус: new, processed, rejected'
        },
        managerId: {
            type: 'bigint',
            references: 'admins',
            onDelete: 'SET NULL',
            comment: 'Менеджер, обработавший заявку'
        },
        processedAt: { type: 'timestamp with time zone', comment: 'Когда обработана' },
        createDate: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func('now()'),
            comment: 'Дата создания заявки'
        },
        updateDate: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func('now()'),
            comment: 'Дата обновления заявки'
        }
    }, { ifNotExists: true, comment: 'Заявки с сайта MetalPro' });

    pgm.createIndex('leads', 'type', { ifNotExists: true });
    pgm.createIndex('leads', 'status', { ifNotExists: true });
    pgm.createIndex('leads', 'phone', { ifNotExists: true });
    pgm.createIndex('leads', 'createDate', { ifNotExists: true });
};

exports.down = pgm => {
    pgm.dropTable('leads', { ifExists: true });
};