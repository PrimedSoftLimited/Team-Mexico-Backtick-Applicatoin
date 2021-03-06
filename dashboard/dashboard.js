// define selector
function _(str) {
    return document.querySelector(str);
}


// global variables
const token = localStorage.getItem('sessionToken');
const userUrl = 'http://backtick.herokuapp.com/public/api/user';
const delUrl = 'http://backtick.herokuapp.com/public/api/goal';


// to create new goal
function activateGoal() {
    if (_("#pseudo-add-goal").classList.contains('active')) {
        _("#pseudo-add-goal").classList.remove('active');
        _("#con-goal").style.height = "calc(83vh - 250px)";
        _("#con-add-goal").classList.add('active');
        _("#activate").classList.add('active');
    }
}


// show goal duration window
function goalDuration() {
    if (_("#goal-settings").classList.contains('active')) {
        _("#goal-settings").classList.remove('active')
    } else {
        _("#goal-settings").classList.add('active')
    }
}


// today's date
function today() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let thisday = yyyy + '-' + mm + '-' + dd;

    return thisday;
}
const ta = today();


// tomorrow's date
function tomorrow() {
    let today = new Date();
    let dd = String(today.getDate() + 1).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let thisday = (yyyy + '-' + mm + '-' + dd).toString();

    return thisday;
}
const ekile = tomorrow();


// spruce up time for ui
(function time() {
    let day = {
        '0': 'Sunday',
        '1': 'Monday',
        '2': 'Tuesday',
        '3': 'Wednesday',
        '4': 'Thursday',
        '5': 'Friday',
        '6': 'Saturday'
    };
    let date = {
        '1': 'st',
        '2': 'nd',
        '3': 'rd',
        '4': 'th',
        '5': 'th',
        '6': 'th',
        '7': 'th',
        '8': 'th',
        '9': 'th',
        '10': 'th',
        '11': 'th',
        '12': 'th',
        '13': 'th',
        '14': 'th',
        '15': 'th',
        '16': 'th',
        '17': 'th',
        '18': 'th',
        '19': 'th',
        '20': 'th',
        '21': 'st',
        '22': 'nd',
        '23': 'rd',
        '24': 'th',
        '25': 'th',
        '26': 'th',
        '27': 'th',
        '28': 'th',
        '29': 'th',
        '30': 'th',
        '31': 'st',
    }
    let month = {
        '0': 'Jan',
        '1': 'Feb',
        '2': 'Mar',
        '3': 'Apr',
        '4': 'May',
        '5': 'Jun',
        '6': 'Jul',
        '7': 'Aug',
        '8': 'Sep',
        '9': 'Oct',
        '10': 'Nov',
        '11': 'Dec'
    };        
    let today = new Date();
    let a = today.getDate();
    let b = today.getDay();
    let c = today.getMonth();
    let d = today.getFullYear();
    let small = document.createElement("small");
    small.innerHTML = date[a];
    small.style.fontSize = ".65em";

    _('#date').innerHTML = a;
    _('#date').append(small);
    _('#day').innerHTML = day[b]; 
    _('#month').innerHTML = month[c];
    _('#year').innerHTML = d;
})();


// get user data. move to profile
axios.get(userUrl, {
    headers: {
        Authorization: token,
    }
}).then((response) => {
    let user = response.data;
    localStorage.setItem('currentUser', JSON.stringify(user));

}).catch((err) => {
    console.log(err.response);
    if (err.response.status == 401) {
        location.replace('../Welcome/welcome.html');
    }
});


// populate user dashboard with goals
function goals() {

    let goalsUrl = 'http://backtick.herokuapp.com/public/api/goals'

    axios.get(goalsUrl, {
        headers: {
            Authorization: token
        }
    }).then((response) => {
        let goal_array = response.data;
        
        for (let i = 0; i < goal_array.length; i++) {

            let obj = goal_array[i];
            let date = obj.finish;
            let today = date.localeCompare(ta);
            let tomorrow = date.localeCompare(ekile);

            if (today==0) {
                _('#today').style.display = "block";
                _('#today').innerHTML += `
            <div class="goal animated slideInUp fast" id="goal${obj.id}">
                <div class="fa checkbox"></div>
                <div>
                    <div id="goal-title">${obj.title}</div>
                    <span id="tag"></span>
                </div>
                <i id="refresh"></i>
                <figure id="time"></figure>
                <figure id="delete"></figure>
            </div>`
            } else if (tomorrow==0) {
                _('#tomorrow').style.display = "block";
                _('#tomorrow').innerHTML += `
            <div class="goal animated slideInUp fast" id="goal${obj.id}">
                <div class="fa checkbox"></div>
                <div>
                    <div id="goal-title">${obj.title}</div>
                    <span id="tag"></span>
                </div>
                <i id="refresh"></i>
                <figure id="time"></figure>
                <figure id="delete"></figure>
            </div>`
            } else {
                _('#upcoming').style.display = "block";
                _('#upcoming').innerHTML += `
            <div class="goal animated slideInUp fast" id="goal${obj.id}">
                <div class="fa checkbox"></div>
                <div>
                    <div id="goal-title">${obj.title}</div>
                    <span id="tag"></span>
                </div>
                <i id="refresh"></i>
                <figure id="time"></figure>
                <figure id="delete"></figure>
            </div>`
            }
        }
        // end loop


        // get tasks on goal click
        document.querySelectorAll(".goal").forEach((goal) => {
            goal.addEventListener('click', () => {
                goal.preventDefault;

                let goalId = goal.id.substring(4);
                let goalUrl = 'http://backtick.herokuapp.com/public/api/goal' + "/" + goalId;

                if (goal.classList.contains('active')) {
                    goal.classList.remove('active');
                    _("#group-subgoal").style.display = "none";
                } else {
                    goal.classList.add('active');
                    axios.get(goalUrl, {
                        headers: {
                            Authorization: token
                        }
                    }).then((response) => {
                        let obj = response.data;
                        taskDetail();

                        function taskDetail() {
                            _("#group-subgoal").style.display = 'block';
                            _("#group-subgoal").innerHTML = `
                            <div id="con-subgoal">
                                <span id="task-deets">task details</span>
                                <span id="activity">activity</span>
                                <div id="subcon-subgoal">
                                    <input id="edit-goal-title" type="text" value="${obj.title}">
                                    <div id="tag-con">
                                        <div class="tag">Important</div>
                                        <div class="tag">Code</div>
                                        <div class="tag">Critical</div>
                                        <div class="tag">Team</div>
                                        <div id="add-tag" class="tag">Add Tag</div>
                                    </div>
                                    <div id="con-edit-goal-time">
                                        <input type="time" class="set-time" id="new-goal-time">
                                        <input type="date" value="${obj.start}" class="set-date" id="new-goal-date">
                                    </div>
                                    <p id="title-subtask">subtasks</p>
                                    <div id="con-subtasks"></div>
                                    <button id="btn-new-subtask">
                                    <span class="fas"></span>
                                    New Subtask</button>
                                    <div id="con-subtask">
                                        <input type="text" id="new-subtask" placeholder="I want to...">
                                        <input type="time" class="set-time" id="new-subtask-time">
                                        <input type="date" class="set-date" id="new-subtask-date">
                                        <button id="submit-subtask">add</button>
                                    </div>
                                    <div id="con-notes">
                                        <p id="notes-head">notes</p>
                                        <textarea id="notes">${obj.description}</textarea>
                                        <div id="con-save">
                                            <button id="save-subgoal">save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>`
        

                            // get tasks
                            function tasks() {
                                let taskUrl = 'http://backtick.herokuapp.com/public/api/' + goalId + '/task';
        
                                axios.get(taskUrl, {
                                    headers: {
                                        Authorization: token
                                    }
                                }).then((response) => {
            
                                    let obj_array = response.data;
                    
                                    for (let i = 0; i < obj_array.length; i++) {
            
                                    _("#con-subtasks").innerHTML += `
                                        <div class="task animated slideInUp fast" id="task${obj_array[i].id}">
                                            <div class="fa checker"></div>
                                            <div>
                                                <div id="task-title">${obj_array[i].description}</div>
                                            </div>
                                            <i id="refresh"></i>
                                            <figure id="time"></figure>
                                            <figure id="delete"></figure>
                                        </div>`
                                    }
                                    

                                    // delete task
                                    document.querySelectorAll('.task #delete').forEach((e) => {
                                        e.addEventListener('click', (event) => {
                                            event.stopImmediatePropagation;
                                            
                                            let delUrl = 'http://backtick.herokuapp.com/public/api/' + goalId + '/task/' + e.parentNode.id.substring(4);

                                            axios.delete(delUrl, {
                                                headers: {
                                                    Authorization: token
                                                }
                                            }).then((response) => {
                                                console.log(response.data);
                                                e.parentNode.remove();
                                            }).catch((error) => {
                                                console.log(error.response);
                                            })
                                        })
                                    })
                                    
                                    // strikethrough on task completion
                                    document.querySelectorAll(".checker").forEach((e) => {
                                        e.addEventListener('click', (event) => {
                                            event.stopPropagation;
                
                                            let id = '#' + e.parentNode.id;

                                            if (e.classList.contains('active')) {
                                                e.classList.remove('active', 'none');
                                                _(id).classList.remove('inactive');
                                            } else {
                                                e.classList.add('active', 'none');
                                                _(id).classList.add('inactive');
                                            }
                                        })
                                    })
                                }).catch((e) => {
                                    console.log(e.response);
                                })
                            }
                            tasks();
        

                            // display subtask input fields
                            _("#btn-new-subtask").addEventListener('click', () => {
                                if (_("#con-subtask").classList.contains('active')) {
                                    _("#con-subtask").classList.remove('active', 'animated', 'fadeIn');
                                    _("#btn-new-subtask").classList.remove('active');
                                } else {
                                    _("#con-subtask").classList.add('active', 'animated', 'fadeIn');
                                    _("#btn-new-subtask").classList.add('active');
                                }
                            });
        

                            // create subtask
                            _("#submit-subtask").addEventListener('click', () => {
                                let taskTitle = _("#new-subtask").value;
                                let taskDate = _("#new-subtask-date").value;
                                let taskUrl = 'http://backtick.herokuapp.com/public/api/' + obj.id + '/task';
                                let task = {
                                    description: taskTitle,
                                    begin: today(),
                                    due: taskDate
                                };
        
                                axios.post(taskUrl, task, {
                                    headers: {
                                        Authorization: token
                                    }
                                }).then((response) => {
                                    let obj = response.data.goal;
        
                                    _("#con-subtasks").innerHTML += `
                                    <div class="task animated slideInUp fast" id="task${obj.goal_id}">
                                        <div class="fa checker"></div>
                                        <div>
                                            <div id="task-title">${obj.description}</div>
                                        </div>
                                        <i id="refresh"></i>
                                        <figure id="time"></figure>
                                        <figure id="delete"></figure>
                                    </div>`
        
                                    _("#con-subtask").classList.remove('active', 'animated', 'fadeIn');
                                    _("#btn-new-subtask").classList.remove('active');
                                    getSubtasks();
                                }).catch((error) => {
                                    console.log(error.response);
                                })
                            })


                            // update goal
                            _('#save-subgoal').addEventListener('click', () => {
                                let title = _('#edit-goal-title').value;
                                let desc = _('#notes').value; 
                                let start = today(); 
                                let end = _('#new-goal-date').value;
                                let editUrl = 'http://backtick.herokuapp.com/public/api/goal' + '/' + goalId;
                                let obj = {
                                    title: title,
                                    description: desc,
                                    start: start,
                                    finish: end
                                }

                                axios.put(editUrl, obj, {
                                    headers: {
                                        Authorization: token
                                    }
                                }).then(() => {
                                    location.reload();
                                }).catch((error) => {
                                    console.log(error.response);
                                })
                            })
                        }
                    }).catch((error) => {
                        console.log(error.response);
                    })
                }
                // end conditional else
            })
        })


        // create new goal
        _('#submit-goal').addEventListener('click', (e) => {
            e.preventDefault;

            let goalUrl = 'http://backtick.herokuapp.com/public/api/goal';
            let title = _('#add-goal-title').value;
            let desc = _('#add-goal').value;
            let gstart = today();
            let gend = _('#goal-due').value;
            const goal = {
                title: title,
                description: desc,
                start: gstart,
                finish: gend
            };

            axios.post(goalUrl, goal, {
                headers: {
                    Authorization: token
                }
            })
            .then(() => {
                location.reload();
            }).catch((err) => {
                console.log(err.response);
            })
        });


        // strikethrough on goal completion
        document.querySelectorAll(".checkbox").forEach((e) => {
            e.addEventListener('click', () => {
                e.stopPropagation;
                e.preventDefault;

                let id = '#' + e.parentNode.id;
                if (e.classList.contains('active')) {
                    e.classList.remove('active', 'none');
                    _(id).classList.remove('inactive');
                } else {
                    e.classList.add('active', 'none');
                    _(id).classList.add('inactive');
                }
            })
        })


        // delete goal
        document.querySelectorAll('.goal #delete').forEach((e) => {
            e.addEventListener('click', (event) => {
                event.preventDefault;
                event.stopPropagation;

                let goal = e.parentNode.id;
                let goalId = e.parentNode.id.substring(4);
                let delUrl = 'http://backtick.herokuapp.com/public/api/goal/' + goalId;

                axios.delete(delUrl, {
                    headers: {
                        Authorization: token
                    }
                }).then(() => {
                    _('#'+goal).remove();
                }).catch((error) => {
                    console.log(error);
                })
            })
        })
    }).catch((error) => {
        console.log(error.response);
    })
}
goals();


// sidebar functionality
_('#hamburger').addEventListener('click', () => {
    if (_('#hamburger').classList.contains('active')) {
        _('#hamburger').classList.remove('active');
        _('#sidebar').classList.remove('active');
        document.querySelectorAll('.flat').forEach((e) => {
            e.classList.remove('active', 'animated', 'slideInLeft');
            document.querySelectorAll(".flat span").forEach((d) => {
                d.classList.remove('animated', 'fadeIn');
            })
        })
    } else {
        _('#hamburger').classList.add('active');
        _('#sidebar').classList.add('active');
        document.querySelectorAll('.flat').forEach((e) => {
            e.classList.add('active', 'animated', 'slideInLeft');
            document.querySelectorAll(".flat span").forEach((d) => {
                d.classList.add('animated', 'fadeIn');
            })
        })
    }
})


_('.lists').addEventListener('click', (e) => {
    e.preventDefault;
    if (_("#my-lists").classList.contains('active')) {
        _("#my-lists").classList.remove('active', 'animated', 'fadeIn');
    } else {
        _("#my-lists").classList.add('active', 'animated', 'fadeIn')
    }
})

_('.tags').addEventListener('click', (e) => {
    e.preventDefault;
    if (_("#my-tags").classList.contains('active')) {
        _("#my-tags").classList.remove('active', 'animated', 'fadeIn');
    } else {
        _("#my-tags").classList.add('active', 'animated', 'fadeIn')
    }
})


// goal dropdown

var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < selElmnt.length; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);


// logout user
_("#logout").addEventListener('click', (e) => {
    e.preventDefault;

    localStorage.removeItem('sessionToken');
    localStorage.removeItem('currentUser');
    location.replace('../Welcome/welcome.html');
})
