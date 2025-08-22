<script>
	import { pulse_connected, pulse_items } from "$lib/stores";
	import FeedView from "../comp/FeedView.svelte";

	let so_far = $derived($pulse_items.length);
</script>

<div class="page">
	<div class="connection" class:connected={$pulse_connected}>
		<span>{$pulse_connected ? "Connected" : "Disconnected"}</span>
		<i class="f7-icons">{$pulse_connected ? "checkmark_alt" : "xmark"}</i>
	</div>
	<div class="heading">
		<div class="title">NPM Pulse</div>
		<div class="subtitle">Watch updates to NPM Registry, Live.</div>
		<div class="last_ten_mins">
			<span>{so_far.toLocaleString()}</span>
			<span> packages so far</span>
		</div>
	</div>
	<FeedView />
</div>

<style lang="scss">
	@use "../styles/theme.scss";
	.page {
		margin: 3rem 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
		height: 100%;
		> .connection {
			position: absolute;
			top: 0;
			right: 0;
			padding: 1rem;
			color: theme.$red;
			&.connected {
				color: theme.$green;
			}
			display: flex;
			align-items: center;
			gap: 0.5rem;
			> i {
				color: inherit;
				font-size: 1.2rem;
			}
			> span {
				font-size: 0.8rem;
				font-weight: 600;
			}
		}
		> .heading {
			display: flex;
			align-items: center;
			flex-direction: column;
			gap: 0.4rem;
			> .title {
				font-size: 3rem;
				font-weight: 600;
			}
			> .subtitle {
				opacity: 0.5;
				font-size: 1.5rem;
			}
			> .last_ten_mins {
				margin-top: 1.5rem;
				font-size: 1.5rem;
				> span {
					&:first-child {
						font-weight: 800;
					}
					&:last-child {
						font-weight: 600;
						opacity: 0.5;
					}
				}
			}
		}
	}
</style>
