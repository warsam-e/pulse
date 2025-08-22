export const IS_PROD = process.env.NODE_ENV === 'production';

export const get_json = <T>(url: string, opts?: RequestInit) => fetch(url, opts).then((r) => r.json() as Promise<T>);

export async function try_prom<T>(prom: Promise<T> | T): Promise<T | undefined> {
	try {
		return await prom;
	} catch (e) {
		console.log(e);
	}
}
