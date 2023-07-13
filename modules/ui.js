export function reload_sel(arr, select) {
   select.innerHTML = ' ';
   for (let item of arr) {
      let op = new Option(item.name, JSON.stringify(item));
      select.append(op);
      select.value = ' '
   }
}
