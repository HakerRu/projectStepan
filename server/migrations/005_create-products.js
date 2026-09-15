exports.up = pgm => {
    pgm.createTable('products', {
        id: { type: 'bigserial', primaryKey: true },
        category: {
            type: 'varchar(50)',
            notNull: true,
            comment: 'Категория: sandwich, proflist'
        },
        name: { type: 'varchar(255)', notNull: true, comment: 'Название продукта' },
        article: { type: 'varchar(100)', comment: 'Артикул' },
        dimensions: { type: 'varchar(255)', comment: 'Размеры' },
        metalThickness: { type: 'varchar(50)', comment: 'Толщина металла' },
        coating: { type: 'varchar(100)', comment: 'Тип покрытия' },
        weight: { type: 'varchar(50)', comment: 'Вес' },
        colors: { type: 'text', comment: 'Цвета RAL (JSON)' },
        purpose: { type: 'text', comment: 'Назначение' },
        filler: { type: 'varchar(100)', comment: 'Наполнитель' },
        price: { type: 'varchar(50)', comment: 'Цена (строка: "от X ₽/м²")' },
        priceNumeric: { type: 'numeric(10,2)', comment: 'Цена числом' },
        imageUrl: { type: 'varchar(500)', comment: 'URL фото' },
        isActive: {
            type: 'boolean',
            notNull: true,
            default: true,
            comment: 'Активен ли продукт'
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
    }, { ifNotExists: true, comment: 'Каталог продукции MetalPro' });

    pgm.createIndex('products', 'category', { ifNotExists: true });
    pgm.createIndex('products', 'isActive', { ifNotExists: true });
};

exports.down = pgm => {
    pgm.dropTable('products', { ifExists: true });
};