<script lang="ts">
	import { onMount } from "svelte";
	import { slide } from "svelte/transition";
	import { circOut } from "svelte/easing";

	import { page } from "$app/stores";
	import ChevronDown from "@fluentui/svg-icons/icons/chevron_down_16_regular.svg?raw";

	import { IconButton, ListItem } from "fluent-svelte";
	import { getCSSDuration } from "fluent-svelte/internal";
	import type { DocsCategory } from "$data/docs";

	export let tree: DocsCategory[] = [];
	$: console.log("docs tree", tree);
	$: topLevelPages = tree.find(c => c.path === "")?.pages ?? [];

	export let initial = true;

	let treeViewState: { [K in DocsCategory["path"]]: boolean };

	onMount(() => {
		// Check localStorage for an existing treeViewState
		// If none exists, use a blank object string
		treeViewState = JSON.parse(localStorage.getItem("treeViewState") ?? "{}");
	});

	// Function for expanding/collapsing docs categories
	const toggleExpansion = (event: MouseEvent, path: string) => {
		event.stopPropagation();

		// Modify treeViewState to have the opposite of the previous entry for the category
		treeViewState[path] = !treeViewState[path];

		// Update value in localStorage for persistence
		localStorage.setItem("treeViewState", JSON.stringify(treeViewState));
	};
</script>

<div class="tree-view scroller" class:initial>
	<!-- include top level pages -->
	{#each topLevelPages as { path, slug, icon, name } (slug)}
		<ListItem
			on:click
			selected={$page.routeId === `docs/${path}/${slug}`}
			href="/docs{path}/{slug}"
		>
			<svelte:fragment slot="icon">
				{@html icon || ""}
			</svelte:fragment>
			{name}
		</ListItem>
	{/each}
	{#each tree.filter(c => c.name.length > 0) as { name, path, pages, icon }}
		<div class="subtree" class:expanded={treeViewState?.[path]}>
			<ListItem on:click={e => toggleExpansion(e, path)}>
				<svelte:fragment slot="icon">
					{@html icon || ""}
				</svelte:fragment>
				<span class="tree-view-item">{name}</span>
				<div class="expander-icon" class:expanded={treeViewState?.[path]}>
					{@html ChevronDown}
				</div>
			</ListItem>
			{#if treeViewState?.[path]}
				<div
					class="subtree-items"
					transition:slide|local={{
						duration: getCSSDuration("--fds-control-fast-duration"),
						easing: circOut
					}}
					class:expanded={treeViewState?.[path]}
				>
					{#each pages as { path, slug, icon, name } (slug)}
						<ListItem
							on:click
							selected={$page.routeId === `docs/${path}/${slug}`}
							href="/docs{path}/{slug}"
						>
							<svelte:fragment slot="icon">
								{@html icon || ""}
							</svelte:fragment>
							{name}
						</ListItem>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	@use "src/styles/mixins" as *;

	.tree-view {
		.subtree {
			:global {
				.list-item span {
					@include flex($align: center, $justify: space-between);
					inline-size: 100%;

					.expander-icon {
						@include flex($align: center);
						transition: transform var(--fds-control-fast-duration)
							var(--fds-control-fast-out-slow-in-easing);
						transform-origin: center;

						&.expanded {
							transform: rotate(180deg);
						}

						svg {
							@include icon;
						}
					}
				}
			}
		}

		&.initial {
			@media screen and (width >= 648px) {
				block-size: calc(100vh - 58px);
			}
		}
	}

	// Add padding to subtrees for the nesting effect
	.subtree-items {
		padding-inline-start: 24px;
	}
</style>
