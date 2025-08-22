<script>
	export const size = "5rem";
</script>

<div class="loading_page">
	<div class="spinner" style="--size: {size};"></div>
</div>

<style lang="scss">
	@use "../styles/theme.scss";

	.loading_page {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.spinner {
		display: inline-block;
		width: var(--size);
		height: var(--size);
		border: 5px solid transparent;
		border-top-color: theme.$mauve;
		border-radius: 50%;
		animation: spin 0.5s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
