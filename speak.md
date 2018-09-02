---
layout: page
title: speak
categories: speak
---
<div class="post-feed">
    <!-- The tag below includes the markup for each post - partials/post-card.hbs -->
    {%  include post-card.html %}
</div>

{% for post in site.posts %}
<div class="row">
	<div class="small-12 columns">

		<sub>{{ post.categories}}</sub>
		<a href="{{ post.url }}"><h3>{{ post.title }}</h3></a>

	  	<!-- {{ post.excerpt }} -->

		<!-- <ul class="inline-list" style="margin-top:-1em;">
			{% for category in post.categories %}
			<li><h6><a href="/#!/{{ category }}"><i class="fa fa-tag"></i> {{ category }}</a></h6></li>
			{% endfor %}
		</ul> -->

	</div>
</div>
{% endfor %}
