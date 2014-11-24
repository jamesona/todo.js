todo.js — a standalone to-do list module
=======
todo.js is a quick mock-up, and my first attempt at OOP style architecture, particularly with JavaScript.
It's a little rough around the edges, and may be refined at the request of others, or if I find I have the time and desire to do so.


[DEMO](http://j-srv.net/todo.html)

Requirements
-------
None!<br />
todo.js has no library dependencies, and can be directly implemented in your project.

Implementation
-------
todo.js must be included in the page, by any normal means.<br />
(ex. ```<script src="./[pathtolibrary]/todo.js"></script>```)<br />
The task-list table is automatically populated, and only requires an appropriately classed table tag.

```<table class="todo"></table>```

In order to detect that tag and generate the table, it is also necessary to instantiate the ToDo class when the page loads.
This can easily be done with a script tag in the document header:
```
<script>
  window.onload = function(){new ToDo()};
</script>
```

The demo stylesheet is included, but not necessary.
