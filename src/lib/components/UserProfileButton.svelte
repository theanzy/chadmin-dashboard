<script lang="ts">
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupMenu',
		placement: 'bottom-end'
	};
</script>

<div class="card p-1 text-sm text-left min-w-[150px] max-w-lg" data-popup="popupMenu">
	<div class="flex flex-col">
		<a href="/" class="p-2 hover:bg-primary-200-700-token w-full rounded">Joshi Chan</a>
		<a href="/" class="p-2 hover:bg-primary-200-700-token w-full rounded">Montanna</a>
		<a
			href="/"
			class="p-2 hover:bg-primary-200-700-token w-full rounded flex flex-row gap-2 items-center"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="48"
				height="48"
				viewBox="0 0 48 48"
				class="w-4 h-4"
				><mask id="ipSPeople0"
					><path
						fill="#fff"
						stroke="#fff"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="4"
						d="M24 20a7 7 0 1 0 0-14a7 7 0 0 0 0 14ZM6 40.8V42h36v-1.2c0-4.48 0-6.72-.872-8.432a8 8 0 0 0-3.496-3.496C35.92 28 33.68 28 29.2 28H18.8c-4.48 0-6.72 0-8.432.872a8 8 0 0 0-3.496 3.496C6 34.08 6 36.32 6 40.8Z"
					/></mask
				><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSPeople0)" /></svg
			> Admin
		</a>
	</div>
</div>
<button
	class="rounded-full w-8 h-8 outline-none btn-icon btn-icon-sm focus-visible:outline-primary-500"
	use:popup={popupClick}
>
	<Avatar
		initials="JD"
		background="bg-primary-500"
		src="https://i.pravatar.cc/150?img=4"
		class="w-full h-full border-0 outline-0"
	/>
</button>
