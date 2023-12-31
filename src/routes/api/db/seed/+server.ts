import { NODE_ENV } from '$env/static/private';
import { faker } from '@faker-js/faker';
import { db } from '$lib/db';
import { users } from '../../../../schema/users';
import { products } from '../../../../schema/products';
import { transactions } from '../../../../schema/transactions';
import { productsTransactions } from '../../../../schema/product_transaction';

const MAX_CUSTOMERS = 300;
const MAX_SALES_AFFILIATE = 50;
const MAX_ADMINS = 20;

const MAX_PRODUCTS = 50;
const categories = ['shoes', 'clothing', 'accessories', 'misc'];

const LIMITED_COUNTRIES = [
	'AUS',
	'AUT',
	'BEL',
	'BRA',
	'CHL',
	'CHN',
	'HRV',
	'EGY',
	'FJI',
	'FRA',
	'DEU',
	'HKG',
	'IND',
	'IDN',
	'ITA',
	'JPN',
	'KOR',
	'MYS',
	'MEX',
	'NZL',
	'PRT',
	'POL',
	'ROU',
	'QAT',
	'SAU',
	'SGP',
	'ESP',
	'CHE',
	'TWN',
	'THA',
	'GBR',
	'USA'
];

export async function POST() {
	if (NODE_ENV !== 'development') {
		return new Response('Bad Request', {
			status: 400
		});
	}
	const startDate = new Date(Date.UTC(2022, 0, 1));
	const endDate = new Date(Date.UTC(2024, 0, 1));
	endDate.setUTCHours(23);
	endDate.setUTCMinutes(0);
	endDate.setUTCSeconds(1);
	const customers = generateManyPeople(1, MAX_CUSTOMERS, 'user');
	const admins = generateManyPeople(MAX_CUSTOMERS + MAX_SALES_AFFILIATE + 1, MAX_ADMINS, 'admin');
	const salesAffiliates = generateManyPeople(MAX_CUSTOMERS + 1, MAX_SALES_AFFILIATE, 'affiliate');
	const sampleProducts = generateManyProducts(MAX_PRODUCTS);
	const myTransactions = generateManyTransactions(startDate, endDate);
	const transactionDetailsRecords = generateTransactionDetails(myTransactions);

	function generateTransactionDetails(mytransactions: ReturnType<typeof generateManyTransactions>) {
		const result: {
			transactionId: number;
			productId: number;
			quantity: number;
		}[] = [];
		for (const t of mytransactions) {
			const transactionId = t.id;
			const productCount = randomInt(1, 10);
			const productIds = new Set();
			while (productIds.size < productCount) {
				const p = sampleProducts[randomInt(0, sampleProducts.length - 1)];
				if (productIds.has(p.id)) {
					continue;
				}
				productIds.add(p.id);
				const quantity = randomInt(1, 10);
				result.push({
					transactionId,
					quantity,
					productId: p.id
				});
			}
		}
		return result;
	}

	function generateManyTransactions(start: Date, end: Date) {
		const result: ReturnType<typeof generateTransaction>[] = [];
		let transactionId = 0;
		for (let d = start; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
			const count = randomInt(1, 5);
			for (let i = 0; i < count; i++) {
				transactionId += 1;
				result.push(generateTransaction(transactionId, new Date(d)));
			}
		}
		return result;
	}

	function generateTransaction(id: number, date: Date) {
		return {
			id,
			affiliateId: salesAffiliates[randomInt(0, MAX_SALES_AFFILIATE - 1)].id,
			customerId: customers[randomInt(0, MAX_CUSTOMERS - 1)].id,
			createdAt: date
		};
	}

	function generateManyPeople(offsetId: number, count: number, role: string) {
		const result: ReturnType<typeof generatePerson>[] = [];
		for (let i = 0; i < count; i++) {
			result.push(generatePerson(offsetId + i, role));
		}
		return result;
	}

	function generatePerson(id: number, role: string) {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		const fullName = `${firstName} ${lastName}`;
		const email = `${firstName}.${lastName}@chad.min`;
		let country = faker.location.countryCode('alpha-3');
		if (!LIMITED_COUNTRIES.includes(country)) {
			country = chooseRandom(['CHN', 'USA', 'JPN', 'GBR']);
		}
		return {
			id: id,
			name: fullName,
			email,
			city: faker.location.city(),
			country: country,
			role: role,
			createdAt: new Date(Date.UTC(2022, 0, 1))
		};
	}

	function generateManyProducts(count: number) {
		const result: ReturnType<typeof generateProduct>[] = [];
		for (let i = 0; i < count; i++) {
			result.push(generateProduct(i + 1));
		}
		return result;
	}

	function generateProduct(id: number) {
		const name = faker.commerce.productName();
		const price = randomInt(50, 300) * 100;
		const description = faker.commerce.productDescription();
		const category = categories[randomInt(0, categories.length - 1)];
		const rating = randomInt(1, 10);
		const supply = randomInt(0, 300);
		return { id, name, price, description, category, rating, supply };
	}

	function randomInt(min: number, max: number) {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	async function seedDb() {
		await db
			.insert(users)
			.values(customers.concat(salesAffiliates).concat(admins))
			.onConflictDoNothing();
		await db.insert(products).values(sampleProducts).onConflictDoNothing();
		await db.insert(transactions).values(myTransactions).onConflictDoNothing();
		await db.insert(productsTransactions).values(transactionDetailsRecords).onConflictDoNothing();
		console.log('seed finish');
	}
	await seedDb();
	return new Response('OK', { status: 200 });
}

function chooseRandom(arr: Array<string>) {
	const idx = Math.floor(Math.random() * arr.length);
	return arr[idx];
}
