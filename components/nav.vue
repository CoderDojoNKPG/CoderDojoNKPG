<template>
	<header>
		<p class="include-failed">Javascript krävs för att visa innehållet på sidan.</p>

		<!--body will be included into all pages-->
		<a href="http://coderdojonkpg.se/index.html"><img src="img/icon/logowithtext.png" id="logo"/></a>
		<input type="checkbox" id="toggleMenu" onchange="updateMenuVisible()" value="Visa meny" />
		<label for="toggleMenu"> </label>

		<nav id="mainMenu">
			<a href="/">Hem</a>
			<!--<a href="summercamp.html">SummerCamp</a>-->
			<a href="koda">Börja koda</a>
			<a href="blicoach">Bli coach</a>
			<a href="stodoss">Stöd oss</a>
			<a href="foreningen">Föreningen</a>
		</nav>
	</header>
</template>
