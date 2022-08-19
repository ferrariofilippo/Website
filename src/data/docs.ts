export type DocsNode = {
	name: string,
	icon?: string,
}

export type DocsPage = DocsNode & {
	path: string,
	slug: string,
}

export type DocsCategory = DocsNode & {
	path: string,
	pages: DocsPage[]
}
