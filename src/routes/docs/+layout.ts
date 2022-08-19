import type { LayoutLoad } from "./$types";
import { getPages } from "./+layout.server";

export const load: LayoutLoad = async ({ url, routeId, data }) => {
	const slug = routeId
		?.replace("docs", "")
		?.substring(routeId?.lastIndexOf("/") + 1);
	const docsPages = getPages();
	const { tree } = data;	

	return {
		pagePath: url.pathname,
		currentPage: docsPages.find(p => p.slug === slug),
		docsPages,
		docs: tree
	};
};
