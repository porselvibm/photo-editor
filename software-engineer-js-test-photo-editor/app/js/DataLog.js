/**
 *  Holding debug messages and clearing it
 * **/
export default function DataLog(msg) {
  if (msg) {
    debugContainer.innerHTML += `<p class="col">${msg}</p>`;
  } else {
    debugContainer.innerHTML = "";
  }
}
