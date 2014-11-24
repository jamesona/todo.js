//ToDo class definition===================================================
var ToDo = function() {
  //Find dom anchor, and initialize table
  var todo = this;
      table = document.getElementsByClassName('todo')[0],
      tableHead = document.createElement('thead'),
      header = tableHead.insertRow(0),
      tableBody = document.createElement('tbody'),
      tableFoot = document.createElement('tfoot')
      footer = tableFoot.insertRow(0),
      add = document.createElement('button'),
      download = document.createElement('button');
  table.appendChild(tableHead);
  table.appendChild(tableFoot);
  header.innerHTML = ''+
    '<th><!-- spacer --></th>'+
    '<th>Task</th>'+
    '<th>Description</th>'+
    '<th>Time</th>'+
    '<th>'+'<button class="add">+</button>'+'</th>';
  footer.innerHTML = '<td colspan="5"></td>';
  footer = footer.firstChild;

  //import or set tasks
  this.loadTasks(tableBody);



  //Create button for removing completed
  var removeComplete = document.createElement('button');
  removeComplete.innerHTML = 'Remove Completed';
  removeComplete.id = 'removeComplete';
  footer.appendChild(removeComplete);
  new Trigger(removeComplete, 'click', function(){
    for (var task in todo.tasks) {
      if (todo.tasks.hasOwnProperty(task)) {
        if (todo.tasks[task].complete == 1) {
          var localTasks = JSON.parse(localStorage.todoTasks);
          delete localTasks[task];
          localStorage.todoTasks = JSON.stringify(localTasks);
          window.location.reload();
        }
      }
    }
  });

  //Register trigger for add button
  new Trigger(header.lastChild.children[0],'click',function(){
    todo.addTask(todo, tableBody);
  });

  table.appendChild(tableBody);
  console.log('to-do initialized');
}

//ToDo Methods-----------------------------------------------------------------
ToDo.prototype.addTask = function(todo, tableBody, data) {
  //define append function
  var append = function(task) {
    todo.tasks[task.uuid] = task;
    console.log('added '+task.uuid+' to table');
    todo.renderTask(tableBody, task);
    todo.saveTasks();
  }
  //map vars if data object supplied
  if (data !== null && typeof data === 'object') {
    var task = {};
    task.uuid = data.uuid;
    task.name = data.name;
    task.time = data.time;
    task.desc = data.desc;
    task.complete = data.complete;
    append(task);
  } else {
    var task = new Task();
    task.modal(task, function(){
      append(task);
    });
  }
}

ToDo.prototype.saveTasks = function() {
  localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
  console.log('tasks saved to localstorage');
}

ToDo.prototype.loadTasks = function(tableBody) {
  tableBody.innerHTML = '';
  var storage = JSON.parse(localStorage.getItem('todoTasks'));
  if (storage !== null && typeof storage === 'object'){
    console.log('loading tasks from localStorage');
    this.tasks = storage;
    var tasks = this.tasks;
    console.log('tasks loaded: ', tasks)
    for (var task in this.tasks) {
      if (tasks.hasOwnProperty(task)) {
        this.addTask(this, tableBody, tasks[task]);
      }
    }
  } else if (storage !== null && storage !== 'object'){
    console.log('localstorage data corrupted or empty: ', localStorage.todoTasks);
    delete localStorage.todoTasks;
    this.tasks = {};
  } else {
    console.log('no tasks in browser storage');
    this.tasks = {};
  }
}

ToDo.prototype.renderTask = function(tableBody, task) {
  var row = document.createElement('tr'),
      time = new Date(Date.parse(task.time) + (new Date().getTimezoneOffset()*60000)),
      date = time.toString().substring(0, 16),
      hour = time.toString().substring(17,18),
      minute = time.toString().substring(19,21);
  if (hour > 12) {hour -= 12; var half = ' AM'} else var half = ' PM';
  time = date+hour+':'+minute+half;
  row.innerHTML = '<td></td>'+
                  '<td>'+task.name+'</td>'+
                  '<td><i>'+task.desc+'</i></td>'+
                  '<td>'+time+'</td>'+
                  '<td></td>';
  check = document.createElement('input'); check.type = 'checkbox';
  check.id = task.uuid;
  row.lastChild.appendChild(check);
  tableBody.appendChild(row);
  //apply css to loaded tasks
  if (task.complete == 1) {
    row.className = 'complete';
    check.checked = 'checked';
  }
  var todo = this;
  //register toggle listener and event
  new Trigger(check,'click',function(){
    task.complete ^= true;
    if (task.complete == 1) {
      row.className = 'complete';
    } else {
      row.className = '';
    }
    todo.saveTasks();
  })
}

//Task class definition===================================================
var Task = function() {
  this.uuid = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  this.name = '';
  this.time = '';
  this.desc = '';
  this.complete = 0;
}

//Task methods------------------------------------------------------------
Task.prototype.modal = function(task, callback) {
  //define elements
  var shade = document.createElement('div'),
      modal = document.createElement('div'),
      table = document.createElement('table'),
      title = document.createElement('tr'),
      row1 = document.createElement('tr'),
      row2 = document.createElement('tr'),
      row3 = document.createElement('tr'),
      submit = document.createElement('button'),
      cancel = document.createElement('button'),
      taskname = document.createElement('input'),
      tasktime = document.createElement('input'),
      taskdesc = document.createElement('textarea');
  //compile modal
  shade.className = 'shade'; shade.appendChild(modal);
  modal.className = 'todomodal'; modal.appendChild(table);
  title.innerHTML = '<th colspan="2">New Task</th>'; table.appendChild(title);
  row1.innerHTML = '<td></td><td></td>'; table.appendChild(row1);
  row1.children[0].appendChild(taskname); taskname.type = 'text';
  taskname.placeholder = 'Task Name'; taskname.id = 'taskName';
  row1.children[1].appendChild(tasktime); tasktime.type = 'datetime-local';
  tasktime.placeholder = 'Task Time'; tasktime.id = 'taskTime';
  row2.innerHTML = '<td colspan="2"></td>'; table.appendChild(row2);
  row2.children[0].appendChild(taskdesc); taskdesc.placeholder = 'Description'; taskdesc.id = 'taskDesc';
  row3.innerHTML = '<td colspan="2"></td>'; table.appendChild(row3);
  submit.innerHTML = 'Add'; cancel.innerHTML = 'Cancel';
  row3.children[0].appendChild(submit); row3.children[0].appendChild(cancel);

  //register listeners
  new Trigger(cancel,'click',function(){
    shade.parentNode.removeChild(shade);
  });
  new Trigger(submit,'click',function(){
    task.name = document.getElementById('taskName').value;
    task.time = document.getElementById('taskTime').value;
    task.desc = document.getElementById('taskDesc').value;
    shade.parentNode.removeChild(shade);
    callback.call();
  });

  //spawn modal
  document.children[0].appendChild(shade);
}

//Trigger class definition================================================
var Trigger = function(elem,eventType,handler) {
  if (elem.addEventListener) {
    elem.addEventListener(eventType, handler, true);
  } else if (elem.attachEvent) {
    elem.attachEvent('on' + eventType, handler);
  }
}
