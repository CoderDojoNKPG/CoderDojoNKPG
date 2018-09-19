<template>
	<div>
		<iframe src="https://studio.code.org/flappy/1"></iframe>

		<section id="main">
			<!--<div style="background-image: url(img/ingela.jpg);" id="cover">	</div>--> <!--optional cover image for page-->
			<h1>Page heading</h1>
			<section class="blocks">
				<article>
					<!--use cover images only when at least 3 articles in section-->
					<!--<div class="img" style="background-image: url(img/forvanad.jpg);"> </div>--> <!-- optional cover image with custom image-->
					<!--Alternativly: <div class="img"> </div>--> <!-- default cover image-->

					<h2>
						Article heading
					</h2>

					<p>
						Article text
					</p>
				</article>
				<article>
					<h2>
						Article heading
					</h2>
					<p>
						Article text
					</p>
				</article>
				<!--more articles go here-->
			</section>

			<h1>Optional: Another section with heading</h1>
			<section class="blocks">
				<article>
					<h2>
						Article heading
					</h2>
					<p>
						First paragraph of text
					</p>
					<p>
						Second paragraph of text
					</p>
				</article>
			</section>

			<div cd-include="footer.html"> <!--footer.html is included by script, change in footer.html to change footer-->
				<a href="footer.html">[Footer]</a> <!--Fallback when JS disabled, do not change-->
			</div>
		</section>
	</div>
</template>
