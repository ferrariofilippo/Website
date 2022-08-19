import type { DocsCategory, DocsNode, DocsPage } from "$data/docs";
import type { LayoutServerLoad } from "./$types";

export const getPages = () => {
	const rawPages = import.meta.glob<DocsNode>(
		["./**/*/+page.md", "./+page.md"], // import all pages + base page
		{ eager: true, import: "metadata" }
	);
	
	return Object.entries(rawPages).map(([path, page]) => {
		const categoryPath = path
			.replace(".", "")
			.replace("/+page.md", "")
			.split("/");

		return {
			path: categoryPath.slice(0, -1).join("/"),
			slug: categoryPath.at(-1),
			...page
		} as DocsPage;
	});
};

const getCategories = (pages: DocsPage[]) => {
	const rawCategories = import.meta.glob<DocsNode>(
		"./**/*/category.md", // import all pages + base page
		{ eager: true, import: "metadata" }
	);

	return Object.entries(rawCategories).map(([path, category]) => {
		const docsPath = path.replace(".", "").replace("/category.md", "");

		return {
			pages: pages.filter(page => page.path === docsPath),
			path: docsPath,
			...category
		} as DocsCategory;
	});
};

export const load: LayoutServerLoad = () => {
	const pages = getPages();
	const categories = getCategories(pages);

	return {
		tree: categories.concat([
			{
				name: "",
				path: "",
				pages: pages.filter(page => page.path === "")
			}
		])
	};
};
