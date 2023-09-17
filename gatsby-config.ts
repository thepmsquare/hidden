import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `hidden`,
    siteUrl: `https://thepmsquare.github.io/hidden`,
    description: `progressive web app to provide encryption and decryption using steganography using the least significant bits of the RGB values of an image on top of advanced encryption standard.`,
  },

  pathPrefix: "/hidden",
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: false,
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: `hidden`,
        short_name: `hidden`,
        start_url: "/",
        icon: "src/images/hidden.svg",
        display: "fullscreen",
        background_color: `#000000`,
        theme_color: `#00ffff`,
        icon_options: {
          purpose: `any maskable`,
        },
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    `gatsby-plugin-offline`,
  ],
};

export default config;
