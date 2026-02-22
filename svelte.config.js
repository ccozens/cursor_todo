import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = { kit: { adapter: adapter(), alias: {
    $lib: 'src/lib'  // Should be here
  } } };

export default config;
