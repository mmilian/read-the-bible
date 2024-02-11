/** @type {import('next').NextConfig} */
const withSerwist = require("@serwist/next").default({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    cacheOnFrontEndNav: true,
    // additionalPrecacheEntries: ["/reading/Rdz%2032"]
});


// module.exports = {
//     // Your Next.js config
// };

module.exports = withSerwist({
    // Your Next.js config
});