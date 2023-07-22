import axios from "axios";
import { reload_sel, reload_select_portal } from "./modules/ui";
let select_portal = document.querySelector('#select_portal')
let select_portal_one = document.getElementById('select_portal_one')
let baseUrl = 'http://localhost:5050';
let modal = document.querySelector('.m-one')
let openBtns = document.querySelectorAll('[data-modal]')
let closeBtns = document.querySelectorAll('[data-close]')
let md = document.querySelector('.modal-wr')
let inputs = document.querySelectorAll('.inputs')
let save = document.querySelector('.save');
let delete_el = document.querySelector('.modal-tr');
openBtns.forEach((btn) => {
   btn.onclick = () => {
      empties = document.querySelectorAll('.emptys__wrapper');
      reload_select_portal(empties, select_portal)
      modal.classList.add('show', 'fade')
   }
})

closeBtns.forEach((btn) => {
   btn.onclick = () => {
      modal.classList.remove('show', 'fade')
   }
})


$.fn.extend({
   editable: function () {
      $(this).each(function () {
         var $el = $(this),
            fontSize = $el.css('font-size'),
            textTans = $el.css('text-transform'),
            $edittextbox = $('<input type="text" class="temporary-input"></input>').css('min-width', $el.width()).css('min-height', $el.height()).css('font-size', fontSize).css('text-transform', textTans),
            submitChanges = function () {
               if ($edittextbox.val() !== '') {
                  $el.html($edittextbox.val());
                  $el.show();
                  axios.patch(baseUrl + '/wrappers/' + $el[0].dataset.itemIndex, { name: $edittextbox.val() })
                  $el.trigger('editsubmit', [$el.html()]);
                  $(document).unbind('click', submitChanges);
                  $edittextbox.detach();
               }
            },
            tempVal;
         $edittextbox.click(function (event) {
            event.stopPropagation();
         });
         $el.click(function (e) {
            tempVal = $el.text().trim();
            $edittextbox.val(tempVal).insertBefore($el)
               .bind('keypress', function (e) {
                  var code = (e.keyCode ? e.keyCode : e.which);
                  if (code == 13) {
                     submitChanges();
                  }
               }).select();
            $el.hide();
            $(document).click(submitChanges);
            return false;
         });
      });
      return this;
   }
});


let box_wr = document.querySelector('.emptys__container')
let temp_id;
let temp_el;
let teams = [];
await axios.get(baseUrl + '/wrappers')
   .then(res => {
      if (res.status === 200 || res.status === 201) {
         reload_boxs(res.data, box_wr, md)
      } else {
         alert('инета нету)')
      }
   })
await axios.get(baseUrl + '/users')
   .then(res => {
      if (res.status === 200 || res.status === 201) {
         teams = res.data
      } else {
         alert('инета нету)')
      }
   })

let teams_clone = Object.assign([], teams);
let teams_clone_one = Object.assign([], teams);
let active_teams = []
let active_teams_one = []
const select = document.getElementById('id_random');
const box = document.getElementsByClassName('humans-box');
const box_one = document.querySelector('.humans-box-one')
const form = document.forms.reg;
let select_one = document.getElementById('select_portal_two')
reload_sel(teams_clone, select)
let empties = document.querySelectorAll('.emptys__wrapper');
reload_select_portal(empties, select_portal)
axios.get(baseUrl + '/todos')
   .then(res => reload(res.data))

async function reload(arr) {
   let temp = [];
   empties = document.querySelectorAll('.emptys__wrapper');
   empties.forEach(q => {
      q.innerHTML = ' '
   })
   for (let todo of arr) {
      let div = document.createElement('div')
      let b = document.createElement('b')
      let p = document.createElement('p')
      let div2 = document.createElement('div');
      let edit = document.createElement('span');
      div2.classList.add('populs');
      for (let id of todo.team) {
         for (let el of teams) {
            if (id === el.id) {
               div2.innerHTML += `<div class="humans-box__item" data-name="${el.name}"><img src="/icons/${el.icon}"></div>`
            }
         }
      }
      div.setAttribute('id', todo.id)
      div.setAttribute('class', 'item')
      div.setAttribute('draggable', true)
      edit.classList.add('edit');
      b.innerHTML = todo.title
      p.innerHTML = todo.description
      div.append(b, p, div2, edit)
      empties.forEach((e, i) => {
         if (e.dataset.por === todo.portal) {
            empties[i].append(div)
         }
      })
      temp.push(div)
      div.ondragstart = () => {
         temp_id = todo.id;
         temp_el = div;
         div.classList.add('hold');
         setTimeout(() => (div.className = 'invisible'), 0);
         delete_el.style.top = '20px';
      }
      div.ondragend = () => {
         div.className = 'item';
         delete_el.style.top = '-64px';
         delete_el.style.border = '0'
         delete_el.style.opacity = '.3'
      }
      let reg_on = document.forms.reg_on;
      reg_on.onsubmit = (e) => {
         e.preventDefault();
      }
      edit.onclick = () => {
         axios.get(baseUrl + '/todos/' + todo.id)
            .then(res => {
               if (res.status === 200 || res.status === 2001) {
                  res = res.data
                  empties = document.querySelectorAll('.emptys__wrapper');
                  reload_select_portal(empties, select_portal_one);
                  document.querySelector('.m-two').classList.add('show', 'fade');
                  inputs.forEach(inpt => {
                     inpt.value = res[`${inpt.name}`] || '';
                  })
                  select_portal_one.value = res.portal.trim();
                  teams_clone_one = Object.assign([], teams);
                  teams_clone_one = teams_clone_one.filter(el => !res.team.includes(el.id));
                  active_teams_one = res.team;
                  reload_sel(teams_clone_one, select_one)
                  reload_sel_item(active_teams_one, box_one, select_one, false);
                  let cl = document.querySelector('[ data-close-two]');
                  cl.onclick = () => {
                     document.querySelector('.m-two').classList.remove('show', 'fade')
                  }
                  save.onclick = () => {
                     const data = {};
                     const fn = new FormData(reg_on);
                     let b = true;
                     fn.forEach((value, key) => {
                        if (!value.length) {
                           b = false;
                        }
                        data[key] = value;
                     })
                     data.team = active_teams_one;
                     if (b) {
                        let ex = data
                        axios.patch(baseUrl + '/todos/' + todo.id, ex)
                           .then(async res => {
                              if (res.status === 200 || res.status === 201) {
                                 await axios.get(baseUrl + '/todos')
                                    .then(res => reload(res.data))
                              } else {
                                 alert("Error")
                              }
                              document.querySelector('.m-two').classList.remove('show', 'fade')
                           })
                     }
                  }
               }
            })
      }
   }
   delete_el.ondragover = (event) => {
      event.preventDefault()
   }
   delete_el.ondragenter = (event) => {
      event.preventDefault();
      delete_el.style.border = '4px solid red';
      delete_el.style.opacity = '1'
   }
   delete_el.ondragleave = (event) => {
      event.preventDefault();
      delete_el.style.border = '0'
      delete_el.style.opacity = '.3'
   }
   delete_el.ondrop = () => {
      axios.delete(baseUrl + '/todos/' + temp_id)
         .then(res => {
            if (res.status === 200 || res.status === 201) {
               temp_el.remove();
            }else{
               console.log("Error deleting todo")
            }
         })
   }
   for (let empty of empties) {
      empty.ondragover = (event) => {
         event.preventDefault()
      }
      empty.ondragenter = function (event) {
         event.preventDefault()
         this.className += ' hovered'
      }
      empty.ondragleave = function () {
         this.classList.remove('hovered')
      }
      empty.ondrop = function () {
         this.classList.remove('hovered')
         temp.forEach((item, index) => {
            if (+item.id === temp_id) {
               this.append(item);
               axios.patch(baseUrl + '/todos/' + item.id, { portal: this.dataset.por.toLocaleLowerCase() })
            }
         })
      }
   }
}


function reload_sel_item(arr, box, select, b = true) {
   box.innerHTML = ' '
   for (let id of arr) {
      for (let item of teams) {
         if (id === item.id) {
            let div = document.createElement('div');
            let img = document.createElement('img');
            let p = document.createElement('p');
            let close = document.createElement('div');
            //style
            div.classList.add("item");
            close.classList.add('close');
            //inner
            img.src = `/icons/${item.icon}`;
            p.innerText = item.name;
            close.innerHTML = "&times;";
            div.id = item.id
            //append
            div.append(img, p, close);
            box.appendChild(div);
            if (b) {
               close.onclick = () => {
                  active_teams = active_teams.filter(id => id !== item.id);
                  teams_clone.push(item);
                  reload_sel(teams_clone, select);
                  div.remove();
               }
            } else {
               close.onclick = () => {
                  active_teams_one = active_teams_one.filter(id => id !== item.id);
                  teams_clone_one.push(item);
                  console.log(active_teams_one, teams_clone_one);

                  reload_sel(teams_clone_one, select);
                  div.remove();
               }
            }
         }
      }
   }
}


form.onsubmit = (e) => {
   e.preventDefault();
   const data = {};
   const fn = new FormData(form);
   let b = true;
   fn.forEach((value, key) => {
      if (!value.length) {
         b = false;
      }
      data[key] = value;
   })
   data.team = active_teams;
   if (b) {
      let ex = data
      axios.post(baseUrl + '/todos', ex)
         .then(res => {
            if (res.status === 200 || res.status === 201) {
               axios.get(baseUrl + '/todos')
                  .then(res => reload(res.data))
            } else {
               alert("Error")
            }
            modal.classList.remove('show', 'fade')
         })
   }
}
select.onchange = () => {
   if (!select.value) {
      return
   }
   let item = JSON.parse(select.value);
   select.value = ' ';
   active_teams.push(item.id);
   teams_clone = teams_clone.filter(el => el.id !== item.id);

   reload_sel(teams_clone, select);
   reload_sel_item(active_teams, box[0], select)
}

select_one.onchange = () => {
   if (!select_one.value) {
      return
   }
   let item = JSON.parse(select_one.value);
   select_one.value = ' ';
   active_teams_one.push(item.id);
   teams_clone_one = teams_clone_one.filter(el => el.id !== item.id);
   reload_sel(teams_clone_one, select_one);
   reload_sel_item(active_teams_one, box_one, select_one, false)
}
function reload_boxs(arr, wrapper, modal) {
   wrapper.innerHTML = '';
   for (let item of arr) {
      let div = document.createElement('div');
      let h2 = document.createElement('h2');
      let wr = document.createElement('div');
      //style
      div.classList.add("emptys__item");
      wr.classList.add('emptys__wrapper');
      let text = item.name[0].toLocaleUpperCase() + item.name.slice(1);
      h2.innerText = text;
      wr.dataset.por = item.id;
      h2.dataset.itemIndex = item.id;
      //append
      div.append(h2, wr);
      wrapper.append(div);

      $(h2).editable();
   };
   let div = document.createElement('div');
   let img = document.createElement('img');
   //style
   div.classList.add('emptys__item', "emptys__item-white");
   img.src = '/icons/plus.png';
   img.width = 64;
   img.height = 64;
   img.draggable = false;
   //append
   div.append(img);
   wrapper.append(div);
   div.onclick = () => {
      modal.style.top = "20px";
      let input = modal.querySelector('input');
      let h2 = modal.querySelector('h2')
      input.onkeydown = (e) => {
         if (e.keyCode === 13 && input.value.length) {
            axios.get(baseUrl + '/wrappers/?name=' + input.value.toLocaleLowerCase().trim())
               .then(res => {
                  if (res.status === 200 || res.status === 201) {
                     if (!res.data.length) {
                        modal.style.top = "-80px";
                        axios.post(baseUrl + '/wrappers', { name: input.value.toLocaleLowerCase().trim() })
                           .then(res => {
                              axios.get(baseUrl + '/wrappers')
                                 .then(res => {
                                    if (res.status === 200 || res.status === 201) {
                                       reload_boxs(res.data, wrapper, modal)
                                       axios.get(baseUrl + '/todos')
                                          .then(res => reload(res.data))
                                    } else {
                                       alert('инета нету)')
                                    }
                                 })
                           })
                     } else {
                        h2.innerText = 'Это имя уже используется!';
                        h2.style.color = 'red';
                        input.value = ' ';
                        setTimeout(() => {
                           h2.innerText = 'Название Контейнера';
                           h2.style.color = '#9eacba';
                        }, 1200);
                     }
                  } else {
                     alert('инета нету)')
                  }
               })
         }
      }
   }
};