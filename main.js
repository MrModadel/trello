import axios from "axios";
import { reload_sel } from "./modules/ui"
let baseUrl = 'http://localhost:5050';
let modal = document.querySelector('.modal')
let openBtns = document.querySelectorAll('[data-modal]')
let closeBtns = document.querySelectorAll('[data-close]')
openBtns.forEach((btn) => {
   btn.onclick = () => {
      modal.classList.add('show', 'fade')
   }
})
closeBtns.forEach((btn) => {
   btn.onclick = () => {
      modal.classList.remove('show', 'fade')
   }
})

let temp_id;


let teams = [
   {
      id: Math.random(),
      name: 'John Doe',
      profession: 'Developer',
      icon: 'icon1.png'
   },
   {
      id: Math.random(),
      name: 'Jane Smith',
      profession: 'Designer',
      icon: 'icon2.png'
   },
   {
      id: Math.random(),
      name: 'Mike Johnson',
      profession: 'Project Manager',
      icon: 'icon3.png'
   },
   {
      id: Math.random(),
      name: 'Sarah Williams',
      profession: 'Marketing Specialist',
      icon: 'icon4.png'
   },
   {
      id: Math.random(),
      name: 'David Brown',
      profession: 'QA Engineer',
      icon: 'icon5.png'
   },
   {
      id: Math.random(),
      name: 'Emily Davis',
      profession: 'Data Analyst',
      icon: 'icon6.png'
   },
   {
      id: Math.random(),
      name: 'Michael Clark',
      profession: 'Business Analyst',
      icon: 'icon7.png'
   },
   {
      id: Math.random(),
      name: 'Olivia Taylor',
      profession: 'Content Writer',
      icon: 'icon8.png'
   },
   {
      id: Math.random(),
      name: 'Daniel Wilson',
      profession: 'UX/UI Designer',
      icon: 'icon9.png'
   },
   {
      id: Math.random(),
      name: 'Sophia Lee',
      profession: 'Product Manager',
      icon: 'icon10.png'
   }
]
let active_teams = []

const select = document.getElementById('id_random');
const box = document.getElementsByClassName('humans-box');

const form = document.forms.reg;
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
   active_teams.push(item);
   teams = teams.filter(el => el.id !== item.id);
   reload_sel(teams, select);
   console.log(box);

   reload_sel_item(active_teams, box[0], select)
}
reload_sel(teams, select)

function reload_sel_item(arr, box, select) {
   box.innerHTML = ' '
   for (let item of arr) {
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
         active_teams = active_teams.filter(el => el.id !== item.id);
         teams.push(item);
         reload_sel(teams, select);
         div.remove();
      }
   }
}



const empties = document.querySelectorAll('.emptys__wrapper');

function reload(arr) {
   let temp = [];
   empties.forEach(q => {
      q.innerHTML = ' '
   })
   for (let todo of arr) {
      let div = document.createElement('div')
      let b = document.createElement('b')
      let p = document.createElement('p')
      let div2 = document.createElement('div');

      div2.classList.add('populs');
      for (let el of todo.team) {
         div2.innerHTML += `
         <div class="humans-box__item" data-name="${el.name}"><img src="/icons/${el.icon}"></div>`
      }
      div.setAttribute('id', todo.id)
      div.setAttribute('class', 'item')
      div.setAttribute('draggable', true)

      b.innerHTML = todo.title
      p.innerHTML = todo.description

      div.append(b, p, div2)
      empties.forEach((e, i) => {
         if (e.dataset.por === todo.portal) {
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
      console.log(empty);

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
               axios.patch(baseUrl + '/todos/' + item.id, { portal: this.dataset.por })
               t = false
            }
         })
      }
   }
}


axios.get(baseUrl + '/todos')
   .then(res => reload(res.data))
