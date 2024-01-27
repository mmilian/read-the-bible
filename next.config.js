/** @type {import('next').NextConfig} */
const withSerwist = require("@serwist/next").default({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    cacheOnFrontEndNav: true,
});


module.exports = withSerwist({
    // Your Next.js config
});
