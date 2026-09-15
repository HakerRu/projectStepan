// Временное хранение данных (пока нет БД)
const productsData = {
    sandwichPanels: [
        {
            id: 1,
            type: 'Стеновая сэндвич-панель',
            article: 'СП-100-МВ',
            dimensions: {
                length: 'до 12 м',
                width: '1.19 м',
                thickness: 100
            },
            metalThickness: '0.5-0.7 мм',
            coating: 'Полиэстер / PVDF',
            weight: '14.5 кг/м²',
            colors: ['RAL 9003', 'RAL 7024', 'RAL 3005'],
            purpose: 'Стеновое ограждение',
            filler: 'Минеральная вата',
            price: 'от 1 450 ₽/м²',
            image: 'images/products/sandwich-wall-100.jpg'
        },
        {
            id: 2,
            type: 'Кровельная сэндвич-панель',
            article: 'СПК-120-PIR',
            dimensions: {
                length: 'до 16 м',
                width: '1.00 м',
                thickness: 120
            },
            metalThickness: '0.6-0.8 мм',
            coating: 'PVDF',
            weight: '16.2 кг/м²',
            colors: ['RAL 7024', 'RAL 5005'],
            purpose: 'Кровельное покрытие',
            filler: 'PIR',
            price: 'от 1 890 ₽/м²',
            image: 'images/products/sandwich-roof-120.jpg'
        }
    ],

    proflist: [
        {
            id: 3,
            type: 'Профлист НС35',
            article: 'НС35-0.5-ПЭ',
            dimensions: {
                length: 'до 12 м',
                width: '1.06 м',
                thickness: 0.5
            },
            metalThickness: '0.5 мм',
            coating: 'Полиэстер',
            weight: '5.4 кг/м²',
            colors: ['RAL 6005', 'RAL 3005', 'RAL 1015'],
            purpose: 'Кровля, фасад',
            price: 'от 520 ₽/м²',
            image: 'images/products/proflist-ns35.jpg'
        }
    ]
};

// Экспорт для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = productsData;
}