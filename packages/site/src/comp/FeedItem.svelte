<script lang="ts">
	import type { ChangeItem } from "$lib/api";
	import { svgs } from "$lib/assets";
	import { current_time } from "$lib/stores";
	import { format_time } from "$lib/time";
	import { fade } from "svelte/transition";

	interface Props {
		item: ChangeItem;
	}

	const { item }: Props = $props();

	const deleted = $derived(item.deleted);
	const pkg = $derived(!deleted ? item.package : null);

	const formatted_time = $derived(format_time(item.time, $current_time));

	function print_maintainers(
		maintainers: NonNullable<typeof pkg>["maintainers"],
	) {
		if (!maintainers || maintainers.length === 0) return "";
		const name = (m: { name: string }) => `@${m.name}`;
		if (maintainers.length === 1) return name(maintainers[0]);
		if (maintainers.length === 2)
			return `${name(maintainers[0])}, ${name(maintainers[1])}`;
		if (maintainers.length === 3)
			return `${name(maintainers[0])}, ${name(maintainers[1])} and ${name(maintainers[2])}`;
		return `${name(maintainers[0])} and ${maintainers.length - 1} others`;
	}

	const href = $derived(
		pkg ? `https://www.npmjs.com/package/${pkg.name}` : null,
	);
</script>

<a
	{href}
	target="_blank"
	rel="noopener noreferrer"
	class="feed_item hover"
	in:fade={{ duration: 500 }}
	class:deleted
>
	<div class="meta">
		<div class="name">
			<span>{item.name}</span>
			{#if pkg && pkg.typings !== "none"}
				<img
					src={svgs[pkg.typings === "typescript" ? "ts" : "dt"]}
					alt=""
				/>
			{/if}
		</div>
		{#if pkg}
			<div class="author">
				by {print_maintainers(pkg.maintainers)}
			</div>
			{#if pkg.description}
				<div class="desc">{pkg.description}</div>
			{/if}
			<div class="subtitle">v{pkg.version} - {formatted_time}</div>
		{:else}
			<div class="subtitle">{formatted_time}</div>
		{/if}
	</div>
	<div class="right">
		{#if deleted}
			<i class="f7-icons">xmark</i>
		{/if}
	</div>
</a>

<style lang="scss">
	@use "../styles/theme.scss";

	.feed_item {
		color: inherit;
		background: theme.$mantle;
		padding: 1.5rem 2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		&.deleted {
			opacity: 0.6;
		}
		> .meta {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			> .name {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				> span {
					font-size: 1.2rem;
					font-weight: 800;
				}
				> img {
					width: 1rem;
					height: 1rem;
				}
			}
			> .author {
				font-weight: 600;
				font-size: 1rem;
				opacity: 0.4;
			}
			> .desc {
				opacity: 0.8;
			}
			> .subtitle {
				margin-top: 0.3rem;
				font-weight: 500;
				opacity: 0.4;
			}
		}
		> .right {
			> i {
				font-size: 1.5rem;
				font-weight: 600;
				color: theme.$red;
			}
		}
	}
</style>
