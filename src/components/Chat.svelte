<script lang="ts">
	import { faComment } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<a href="#" class="Settings"><Fa icon={faComment} size="2x" /></a>

<style>
	.Settings {
		background-color: #555;
		color: #9e9e9e;
		text-decoration: none;
		padding: 15px 26px;
	}
</style>
