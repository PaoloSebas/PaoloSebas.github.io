---
layout: archive
title: "Teaching Experience"
permalink: /teaching/experience/
author_profile: false
---

{% include base_path %}

<p>
  <img src="{{ base_path }}/images/Career.png" alt="Career history" style="max-width: 100%;">
</p>

Below, you will find a detailed overview of my teaching experience, listed in reverse chronological order (most recent first).{% for post in site.teaching reversed %}
  {% include archive-single.html %}
{% endfor %}
