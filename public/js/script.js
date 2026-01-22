// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()


const toggle = document.getElementById("taxToggle");
const prices = document.querySelectorAll(".price");
const gstText = document.querySelectorAll(".gst-text");

function formatINR(num) {
  return num.toLocaleString("en-IN");
}

function updatePrices(showGST) {
  prices.forEach((p, i) => {
    let basePrice = Number(p.dataset.price);

    if (!basePrice) return;

    if (showGST) {
      let gstPrice = Math.round(basePrice * 1.18);
      p.innerText = formatINR(gstPrice);
      gstText[i].classList.remove("d-none");
    } else {
      p.innerText = formatINR(basePrice);
      gstText[i].classList.add("d-none");
    }
  });
}

toggle.addEventListener("change", () => {
  updatePrices(toggle.checked);
})
