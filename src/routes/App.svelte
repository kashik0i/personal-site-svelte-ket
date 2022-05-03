<script lang="ts">
	import { User, Message } from '../model';
	import { user, messages, pushMessage, setUser, roomUsers } from './../store';
	import { Server } from '../main';
	import Fa from 'svelte-fa';
	import {
		faPaperPlane,
		faGear,
		faQuestion,
		faUser,
		faCancel,
		faCheck,
		faSpinner
	} from '@fortawesome/free-solid-svg-icons';
	import { Bell, Settings, Burger, Chat, Games, Profile, Video } from '../components';

	const server = new Server();
	let clientWidth: number;
	let clientHeight: number;
	let view = 'chat';
	let chatInputText = '';
	let readonly = true;
	let toggleGuestForm = false;
	let isHandelingGuest = false;
	let loggedInOrGuest = false;
	let messageTarget: string;
	function handleEnter(e: KeyboardEvent) {
		if (e.key == 'Enter') handleSubmit(e);
	}
	const handleSubmit = async (e: Event) => {
		if (!messageTarget) {
			console.error('no message target');
			return;
		}
		console.log(e, chatInputText);
		const message = new Message($user.username, chatInputText);
		const result = await server.pushMessage(message, messageTarget);
		console.log(message, result);
		if (result.ok) {
			pushMessage(message);
			console.log(message);
		}

		chatInputText = '';
	};
	let animateOption = [];
	// const ideas = server.fetchAll();
	const options = [faGear, faUser, faQuestion];
	let guestName: string;
	const handleLogin = () => {};
	const handleGuest = async () => {
		isHandelingGuest = true;
		try {
			const result = await server.createGuestUser(guestName);
			if (result.ok && result.username !== '') {
				setUser(new User(result.username));
			} else {
				console.error('login failed', result);
			}
			console.log(result);
		} catch (error) {
			console.error(error);
		}

		isHandelingGuest = false;
		toggleGuestForm = false;
		readonly = false;
		loggedInOrGuest = true;
	};
</script>

<div class="app" bind:clientHeight bind:clientWidth>
	<div class="options">
		{#if clientWidth < 1026}
			<Burger />
			{#if view === 'chat'}
				<Video />
				<Profile />
			{:else if view === 'video'}
				<Chat />
				<Profile />
			{:else if view === 'profile'}
				<Chat />
				<Video />
			{/if}
		{:else}
			<Profile />
		{/if}

		<Bell />
		<Settings />
		<Games />
	</div>

	<div class="main">
		<div class="video" />
		<div class="dashboard" />
	</div>

	<div class="chat">
		<div class="chat-body">
			<!-- <p value={userValue?.username} /> -->
			{#each $messages as message}
				<div class="message" class:my-message={message.from === $user.username}>
					<!-- <div class="message-header">{message.from}</div> -->
					<div class="message-body">
						{#if message.from !== $user.username}
							<div class="message-sender">{message.from}</div>
						{/if}

						<div class="message-content">{message.content}</div>
						<!-- <div class="message-time">{10}</div> -->
					</div>
				</div>
			{/each}
		</div>
		{#if !loggedInOrGuest}
			<div class="chat-options">
				{#if !toggleGuestForm}
					<button on:click={handleLogin}>login</button>
					<button
						on:click={() => {
							toggleGuestForm = !toggleGuestForm;
						}}>guest</button
					>
				{:else}
					<form on:submit|preventDefault={handleGuest}>
						<input type="text" required bind:value={guestName} />
						<button disabled={isHandelingGuest}
							>{#if isHandelingGuest}
								<Fa icon={faSpinner} spin size="1x" />
							{:else}
								<Fa icon={faCheck} size="1x" />
							{/if}</button
						>
					</form>
					<button
						on:click={() => {
							toggleGuestForm = !toggleGuestForm;
						}}><Fa icon={faCancel} size="1x" /></button
					>
				{/if}
			</div>
		{:else}
			<select bind:value={messageTarget}>
				<option value="global">global</option>
				{#each $roomUsers as item}
					<!-- content here -->
				{/each}
			</select>
		{/if}

		<div class="chat-input">
			<input
				type="text"
				name="chat"
				on:keydown={handleEnter}
				bind:value={chatInputText}
				required
				readonly={readonly || !messageTarget}
			/>
			<button disabled={readonly || !messageTarget} on:click={handleSubmit}
				><Fa icon={faPaperPlane} /></button
			>
		</div>
	</div>
</div>

<style type="text/scss">
	.app {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: max-content auto 25%;
	}
	// .app.small {
	// 	width: 100%;
	// 	height: 100%;
	// 	display: grid;
	// 	grid-template-columns: max-content 1fr;
	// }
	.options {
		display: grid;
		grid-auto-flow: row;
		grid-template-rows: auto;
		background-color: blue;
	}
	.option {
		width: 100%;
		width: 100%;
	}
	.main {
		display: grid;
		grid-template-rows: auto 10%;
		background-color: green;
	}

	.dashboard {
		display: grid;
		grid-template-columns: 10% auto 25%;
		background-color: beige;
	}
	.chat {
		display: grid;
		grid-template-rows: 1fr;
		min-height: max-content;
		// grid-auto-flow: row;
		* {
			height: 100%;
		}
	}
	.chat-body {
		display: grid;
		grid-auto-rows: 10%;
		grid-template-columns: 1fr;
		overflow: auto;
		background-color: whitesmoke;
	}
	.chat-input {
		display: grid;
		grid-template-columns: auto 10%;
		align-items: auto;
	}
	.chat-options {
		display: grid;
		// grid-template-columns: ;
		grid-auto-flow: column;
		form {
			display: contents;
		}
	}
	.message {
		display: inline-flex;
		align-content: space-evenly;
		padding: 3px;
		flex-wrap: wrap;
		gap: 10px 20px;
	}

	.message-body {
		// .message-sender {
		// 	flex-flow: column-reverse;
		// }
		// .message-content {
		// 	padding: 10px;
		// 	grid-row: 2;
		// }
		// .message-time {
		// 	grid-row: 3;
		// }

		display: flex;
		flex-direction: column;
		float: right;
		gap: 10px 20px;
		height: fit-content;

		border: 2px solid rgb(233, 171, 88);
		border-radius: 5px;
		background-color: rgba(233, 171, 88, 0.5);
		padding: 1em;
		color: #d9480f;
		display: flex;
		justify-content: space-between;
	}
	.my-message {
		flex-flow: row-reverse;
	}
	#icon {
		display: inline-block;
		width: 100%;
		height: 100%;
		position: relative;
		vertical-align: bottom;
	}
	body {
		margin: 0;
		padding: 0;
	}
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
	@media only screen and (max-width: 1026px) {
		.main {
			display: none;
		}
		.app {
			grid-template-columns: max-content 1fr;
		}
	}
</style>
