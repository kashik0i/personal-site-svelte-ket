<script lang="ts">
	import Fa from 'svelte-fa';

	import { faBell } from '@fortawesome/free-solid-svg-icons';

	function getRandomInt(min: number, max: number): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	export let notifications = getRandomInt(5, 20);
	// const ringHandler = (e) => {
	// 	let ele: SVGAElement = e.target.children[0];
	// 	console.log(ele);
	// 	ele.style.all = 'animation: ring 4s 0.7s ease-in-out infinite';
	// 	console.log(ele.style);
	// };
	//   style.animation="spin2 4s linear infinite";
</script>

<a href="#" class="notification">
	{#if notifications}
		<Fa icon={faBell} size="2x" class="bell ring" />
		<span class="badge">{notifications}</span>
	{:else}
		<Fa icon={faBell} size="2x" class="bell" />
	{/if}
</a>

<style>
	.notification {
		background-color: #555;
		color: white;
		text-decoration: none;
		padding: 15px 26px;
		position: relative;
		display: inline-block;
		border-radius: 2px;
	}

	/* .notification:hover {
    background: red;
  } */

	.notification .badge {
		position: absolute;
		top: 46px;
		right: 10px;
		padding: 5px 10px;
		border-radius: 50%;
		background: red;
		color: white;
	}
</style>
