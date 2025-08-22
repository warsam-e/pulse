<script lang="ts">
	import { pulse_connected, pulse_items } from "$lib/stores";
	import FeedItem from "./FeedItem.svelte";
	import Loading from "./Loading.svelte";
</script>

<div
	class="feed_view"
	class:waiting={!$pulse_connected && !$pulse_items.length}
>
	{#each $pulse_items as item (item.seq)}
		<FeedItem {item} />
	{:else}
		<Loading />
	{/each}
</div>

<style lang="scss">
	.feed_view {
		width: 100%;
		display: flex;
		flex-direction: column;
		&.waiting {
			margin: 5rem 0;
		}
	}
</style>
