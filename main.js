import axios from "axios";
import { reload_sel, reload_select_portal } from "./modules/ui";
let select_portal = document.querySelector('#select_portal')
let baseUrl = 'http://localhost:5050';
let modal = document.querySelector('.modal')
let openBtns = document.querySelectorAll('[data-modal]')
let closeBtns = document.querySelectorAll('[data-close]')
let md = document.querySelector('.modal-wr')
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
let box_wr = document.querySelector('.emptys__container')
let temp_id;
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
let active_teams = []
const select = document.getElementById('id_random');
const box = document.getElementsByClassName('humans-box');
const form = document.forms.reg;
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

      b.innerHTML = todo.title
      p.innerHTML = todo.description

      div.append(b, p, div2)
      empties.forEach((e, i) => {
         if (e.dataset.por.toLocaleLowerCase() === todo.portal.trim()) {
            empties[i].append(div)
         }
      })
      temp.push(div)
      div.ondragstart = () => {
         temp_id = todo.id
         div.classList.add('hold')
         setTimeout(() => (div.className = 'invisible'), 0)
      }
      div.ondragend = () => {
         div.className = 'item'
      }
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
            let t = true;
            if (+item.id === temp_id && t) {
               this.append(item);
               axios.patch(baseUrl + '/todos/' + item.id, { portal: this.dataset.por.toLocaleLowerCase() })
               t = false
            }
         })
      }
   }
}


function reload_sel_item(arr, box, select) {
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
            close.onclick = () => {
               active_teams = active_teams.filter(id => id !== item.id);
               teams_clone.push(item);
               reload_sel(teams_clone, select);
               div.remove();
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
      wr.dataset.por = text;
      //append
      div.append(h2, wr);
      wrapper.append(div);
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