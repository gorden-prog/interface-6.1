(function (app) {
	'use strict';

	app.data.tireVisuals = {
		summer: 'assets/images/tire-summer-cutout.png',
		winter: 'assets/images/tire-winter-cutout.png',
		all: 'assets/images/tire-all-season-cutout.png'
	};

	app.data.brands = ['Michelin', 'Pirelli', 'Continental', 'Bridgestone', 'Hankook', 'Nokian Tyres', 'Yokohama', 'Cordiant'];

	app.data.seasons = {
		summer: 'Летние',
		winter: 'Зимние',
		all: 'Всесезонные'
	};

	const PRODUCT_ROWS = [
		["Michelin", "Pilot Sport 4", 225, 45, 17, "summer", 94, "Y", "car", 29700, 0, true, true],
		["Continental", "PremiumContact 7", 205, 55, 16, "summer", 91, "V", "car", 18150, 0, true, true],
		["Pirelli", "P Zero", 245, 40, 18, "summer", 97, "Y", "car", 15242, 0, true, true],
		["Bridgestone", "Blizzak Ice", 215, 60, 17, "winter", 96, "S", "suv", 10200, 0, true, true],
		["Hankook", "Ventus Prime 4", 205, 55, 16, "summer", 91, "V", "car", 6350, 0, true, true],
		["Nokian Tyres", "Hakkapeliitta 10 SUV", 225, 55, 18, "winter", 102, "T", "suv", 40400, 0, true, true],
		["Yokohama", "BluEarth-GT AE51", 205, 65, 16, "summer", 95, "H", "car", 8854, 0, true, false],
		["Cordiant", "Comfort 2", 185, 65, 15, "summer", 92, "H", "car", 4500, 0, true, false],
		["Michelin", "Primacy 4", 215, 55, 17, "summer", 94, "V", "car", 22399, 0, true, false],
		["Michelin", "X-Ice Snow", 205, 60, 16, "winter", 96, "H", "car", 15005, 0, true, false],
		["Michelin", "CrossClimate 2", 225, 50, 18, "all", 95, "V", "car", 25960, 0, true, false],
		["Pirelli", "Cinturato P7", 225, 45, 17, "summer", 91, "W", "car", 11050, 0, true, false],
		["Pirelli", "Ice Zero 2", 215, 65, 16, "winter", 102, "T", "suv", 11550, 0, true, false],
		["Pirelli", "Scorpion All Season SF2", 255, 55, 19, "all", 111, "W", "suv", 20960, 0, false, false],
		["Continental", "SportContact 7", 255, 35, 19, "summer", 96, "Y", "car", 24750, 0, true, false],
		["Continental", "VikingContact 7", 195, 65, 15, "winter", 95, "T", "car", 8240, 0, true, false],
		["Continental", "AllSeasonContact 2", 215, 55, 17, "all", 98, "V", "car", 31590, 0, true, false],
		["Bridgestone", "Turanza T005", 205, 55, 16, "summer", 91, "V", "car", 8096, 0, true, false],
		["Bridgestone", "Potenza Sport", 245, 45, 18, "summer", 100, "Y", "car", 23750, 0, true, false],
		["Bridgestone", "Weather Control A005 EVO", 215, 55, 18, "all", 99, "V", "suv", 18393, 0, false, false],
		["Hankook", "Winter i*cept evo3", 235, 50, 17, "winter", 100, "V", "car", 14520, 0, true, false],
		["Hankook", "Kinergy 4S2", 205, 55, 16, "all", 94, "H", "car", 10600, 0, true, false],
		["Hankook", "Dynapro HP2", 235, 60, 18, "summer", 103, "H", "suv", 14600, 0, true, false],
		["Nokian Tyres", "Hakka Blue 3", 205, 55, 16, "summer", 94, "V", "car", 5743, 0, true, false],
		["Nokian Tyres", "Nordman 7", 195, 65, 15, "winter", 95, "T", "car", 3470, 0, true, false],
		["Nokian Tyres", "Seasonproof", 215, 60, 17, "all", 100, "V", "suv", 16490, 0, false, false],
		["Yokohama", "iceGUARD iG65", 205, 55, 16, "winter", 94, "T", "car", 7720, 0, true, false],
		["Yokohama", "Geolandar CV G058", 225, 65, 17, "all", 102, "H", "suv", 10700, 0, true, false],
		["Yokohama", "ADVAN Sport V107", 275, 40, 20, "summer", 106, "Y", "suv", 30000, 0, true, false],
		["Cordiant", "Snow Cross 2", 185, 65, 15, "winter", 92, "T", "car", 6060, 0, true, false],
		["Cordiant", "Winter Drive 2", 175, 70, 13, "winter", 82, "T", "car", 4930, 0, true, false],
		["Cordiant", "All-Terrain", 205, 70, 15, "all", 100, "H", "suv", 7530, 0, true, false]
	];

	app.data.products = PRODUCT_ROWS.map((row, index) => {
		const [brand, model, width, profile, diameter, season, loadIndex, speedIndex, carType, price, oldPrice, available, popular] = row;
		const seasonDescription = season === 'winter'
			? 'зимняя модель для холодного сезона'
			: season === 'all'
			? 'всесезонная модель для умеренных погодных условий'
			: 'летняя модель для поездок в тёплый сезон';
		return {
			id: 'tire-' + (index + 1),
			brand,
			model,
			width,
			profile,
			diameter,
			season,
			loadIndex,
			speedIndex,
			carType,
			price,
			oldPrice,
			available,
			popular,
			image: app.data.tireVisuals[season],
			description: brand + ' ' + model + ' — ' + seasonDescription + '. ' + 'Подберите подходящий размер и индексы по руководству вашего автомобиля. ' + 'Перед покупкой уточните совместимость и характеристики у производителя.'
		};
	});

	app.data.serviceGroups = [
		{
			title: 'Шиномонтаж и балансировка',
			items: [
				['Сезонная замена шин', '4 шт.', 2000],
				['Срочный шиномонтаж', '', 1000],
				['Балансировка колёс', '', 1000],
				['Компьютерная балансировка', '1 шт.', 200],
				['Лазерная балансировка колеса', '1 шт.', 500],
				['Удаление секретных болтов', '1 шт.', 1000]
			]
		},
		{
			title: 'Ремонт шин и колёс',
			items: [
				['Горячая вулканизация шин', '1 шт.', 1500],
				['Ремонт грыжи на шине', '1 шт.', 1500],
				['Ремонт колёс', '1 шт.', 1000]
			]
		},
		{
			title: 'Правка и восстановление дисков',
			items: [
				['Правка дисков', '1 шт.', 1000],
				['Правка осевого смещения', '1 шт.', 1500],
				['Алмазная проточка', '1 шт.', 1500],
				['Порошковая покраска дисков', '1 шт.', 1500],
				['Ремонт литых дисков', '1 шт.', 2200],
				['Сварка литых дисков', '1 см²', 550],
				['Аргонная сварка TIG · алюминий', '1 см²', 500],
				['Восстановление дисков аргоном', '1 см² · трещины и сколы', 500]
			]
		},
		{
			title: 'Выездной шиномонтаж',
			items: [
				['Шиномонтаж на дом', '', 1500],
				['Выездной ремонт шин', '1 шт. · порезы, проколы, ремонт дисков', 1000],
				['Выездной шиномонтаж', '1 шт.', 1500],
				['Мобильный шиномонтаж', '1 шт.', 1000],
				['Шиномонтаж на выезд', '1 шт.', 1000],
				['Шиномонтаж на дому', '4 шт.', 2000]
			]
		},
		{
			title: 'Техническая помощь',
			items: [
				['Доставка топлива', '1 услуга', 1500],
				['Замена колодок', '2 шт.', 1500],
				['Техническая помощь на дороге', '1 услуга', 1500]
			]
		},
		{
			title: 'Автокондиционер',
			items: [
				['Не работает кондиционер', '', 1000],
				['Заправка кондиционера фреоном R134а', '100 г', 500]
			]
		}
	];

	app.data.contacts = {
		phone: '+7 (903) 214-32-13',
		tel: 'tel:+79032143213',
		email: 'rabochiiacaunt@mail.ru',
		locations: [
			{
				address: 'г. Москва, 2-й Иртышский проезд, д. 16, стр. 1',
				title: '2-й Иртышский проезд,<br>д. 16, стр. 1'
			},
			{ address: 'г. Москва, Костомаровская набережная, 29А', title: 'Костомаровская<br>набережная, 29А' }
		]
	};
})(window.ShinMaster);
