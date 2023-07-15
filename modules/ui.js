import axios from "axios";
let baseUrl = 'http://localhost:5050';
export function reload_sel(arr, select) {
   select.innerHTML = ' ';
   for (let item of arr) {
      let op = new Option(item.name, JSON.stringify(item));
      select.append(op);
      select.value = ' ';
   };
};



export function reload_select_portal(items, select) {
   select.innerHTML = ' ';
   for (let item of items) {
      let op = new Option(item.dataset.por, item.dataset.por.toLocaleLowerCase().trim());
      select.append(op);
   };
}