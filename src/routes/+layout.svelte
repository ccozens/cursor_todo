<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { auth, loginWithGoogle } from '$lib/firebase';
	import { onMount } from 'svelte';

	// 1. In Svelte 5, use $props for children
	let { children } = $props();

	// 2. Use the $state rune so the UI reacts when this changes
	let user = $state(null);
    let loading = $state(true); // Added to prevent a "flicker"

	onMount(() => {
		// Firebase listener
		const unsubscribe = auth.onAuthStateChanged((u) => {
			user = u;
			loading = false;
		});
		return unsubscribe; // Cleanup on unmount
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if loading}
	<p>Checking authentication...</p>
{:else if user}
    {@render children()}
{:else}
	<div class="login-container">
		<h1>Todo App</h1>
		<button onclick={loginWithGoogle}>Login with Google</button>
	</div>
{/if}