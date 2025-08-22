<script lang="ts">
	import { pulse_watch } from "$lib/api";
	import "framework7-icons/css/framework7-icons.css";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import "../styles/global.scss";
	const { children } = $props();

	function init() {
		pulse_watch();
	}

	onMount(init);
</script>

<main in:fade={{ duration: 300 }}>
	{@render children?.()}
</main>

<style lang="scss">
	main {
		height: 100dvh;
		overflow: hidden;
	}
</style>
