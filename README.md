CoderDojoNKPG
=============

Website for CoderDojo Norrköping, using Vue.js and NUXT.

The layout (e.g. header and footer) is in the layouts folder.
The pages (e.g. index or blicoach) are in the pages folder.

To run the website locally, write into the terminal: ```npm run dev```

How to deploy on GitHub Pages
--------------------------
Nuxt.js gives you the ability to host your web application on any static hosting. To generate our web application into static files and then on GitHub Pages:

1. ```npm run generate``` to generate a static website in the dist folder
2. ```npm run deploy``` to deploy the dist folder to the gh-pages branch

Source: https://nuxtjs.org/guide/commands#production-deployment, Static Generated Deployment, and https://nuxtjs.org/faq/github-pages

PS: since the gh-pages branch should include only the static files (i.e. the content in the dist folder), the whole GitHub project can live in the master branch, like suggested in https://gist.github.com/cobyism/4730490.

Do you want to contribute?
--------------------------
There are lots of ways! Here are some examples:

* create reusable components, like with footer.vue and nav.vue, for code that often gets repeated
* your own ideas
