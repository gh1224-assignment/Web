/* sidebar */
document.getElementsByClassName("openNavBtn")[0].addEventListener("click", function () {
  document.getElementById("mySidenav").style.width = "250px";
});

document.getElementsByClassName("closebtn")[0].addEventListener("click", function () {
  document.getElementById("mySidenav").style.width = "0";
});



/* carousel */
var curSlideIndex = 0;
showSlides(curSlideIndex);

document.getElementsByClassName("prev")[0].addEventListener("click", function () {
  showSlides(curSlideIndex -= 1);
});

document.getElementsByClassName("next")[0].addEventListener("click", function () {
  showSlides(curSlideIndex += 1);
});

var thumbnails = document.getElementsByClassName("thumbnail");
for (let i = 0; i < thumbnails.length; i++) {
  thumbnails[i].addEventListener("mouseover", function () {
    showSlides(curSlideIndex = i);
  });
}

function showSlides(n) {
  var slides = document.getElementsByClassName("mySlides");
  var thumbs = document.getElementsByClassName("thumbnail");

  if (n >= slides.length)
    curSlideIndex = 0;
  else if (n < 0)
    curSlideIndex = slides.length - 1;

  for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (var i = 0; i < thumbs.length; i++) {
    thumbs[i].classList.remove("active");
  }
  slides[curSlideIndex].style.display = "block";
  thumbs[curSlideIndex].classList.add("active");
}



/* accordion */
var acc = document.getElementsByClassName("accordion");
for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    var isContain = this.classList.contains("active");

    for (var j = 0; j < acc.length; j++) {
      if (acc[j].classList.contains("active")) {
        acc[j].classList.remove("active");
        var panel = acc[j].nextElementSibling;
        panel.style.display = "none";
        break;
      }
    }

    if (!isContain) {
      this.classList.add("active");
      var panel = this.nextElementSibling;
      panel.style.display = "block";
    }
  });
}



/* 주문 */
function create(tagName, className, text) {
  var newTag = document.createElement(tagName);
  newTag.setAttribute('class', className);
  newTag.innerText = text;
  return newTag;
}

function createButton(className) {
  var btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('class', className);
  return btn;
}

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function changePrices(event, prevValue, newValue)
{
  var price = event.target.parentNode.parentNode.getElementsByClassName('number')[0];
  var priceOfOne = price.getAttribute('value');
  var calculated = priceOfOne * newValue;
  price.innerText = numberWithCommas(calculated + '');
  addTotalPrice(priceOfOne * (newValue - prevValue));
}

function addTotalPrice(gap) {
  var total = document.getElementsByClassName('total-price')[0].getElementsByClassName('number')[0];
  var newValue = total.getAttribute('value') * 1 + gap * 1;
  total.setAttribute('value', newValue);
  total.innerText = numberWithCommas(newValue);
}

// select box 선택 시 아이템 추가
var selectBox = document.getElementsByName("products")[0];
selectBox.addEventListener("change", function () {
  const price = 39800;
  const surcharges = {
    A: 0,
    B: 10000,
    C: 20000
  }
  var selected = this.options[this.selectedIndex].value;
  if (typeof surcharges[selected] == 'undefined')   // 선택
    return;
  var addedItems = document.getElementsByClassName('added');
  for (var i in [...addedItems]) {
    if (addedItems[i].getAttribute('value') == selected) {
      alert('이미 선택한 옵션입니다.');
      return;
    }
  }

  var productName = this.options[this.selectedIndex].text;
  var priceOfOne = price + surcharges[selected];

  
  var root = document.getElementsByClassName("selected-products")[0];
  var li = create('li', 'added', '');
  li.setAttribute('value', selected);
  root.appendChild(li);

  li.appendChild(create('p', '', productName));
  var bottomContainer = create('div', 'float-end', '');
  li.appendChild(bottomContainer);
  li.appendChild(createButton("remove"));

  var amountChange = create('div', 'change-amount', '');
  bottomContainer.appendChild(amountChange);
  var span = create('span', 'price', '');
  bottomContainer.appendChild(span);

  amountChange.appendChild(createButton('minus'));
  var input = create('input', 'amount');
  input.setAttribute('type', 'text');
  input.setAttribute('value', '1');
  amountChange.appendChild(input)
  amountChange.appendChild(createButton('plus'));

  var num = create('span', 'number', numberWithCommas(priceOfOne));
  num.setAttribute('value', priceOfOne);
  span.appendChild(num);
  span.appendChild(document.createTextNode('원'));

  addTotalPrice(priceOfOne);
});

var selectedUl = document.getElementsByClassName('selected-products')[0];

// 제거 버튼 클릭
selectedUl.addEventListener("click", function (event) {
  if (event.target.className == 'remove') {
    var sibling = event.target.previousElementSibling;
    var amount = sibling.getElementsByClassName("amount")[0].getAttribute('value') * 1;
    var priceOfOne = sibling.getElementsByClassName('number')[0].getAttribute('value') * 1;
    addTotalPrice(-1 * amount * priceOfOne);
    event.target.parentNode.remove();
    selectBox.selectedIndex = 0;
  }
});

// 수량 감소 버튼 클릭
selectedUl.addEventListener("click", function (event) {
  if (event.target.className == 'minus') {
    var amount = event.target.nextElementSibling;
    var prevValue = amount.getAttribute('value') * 1;
    if (prevValue == 1) {
      alert("1개 이상부터 구매하실 수 있습니다.");
      return;
    }
    amount.setAttribute('value', prevValue - 1);
    amount.value = prevValue - 1;

    changePrices(event, prevValue, prevValue - 1);
  }
});

// 수량 증가 버튼 클릭
selectedUl.addEventListener("click", function (event) {
  if (event.target.className == 'plus') {
    var amount = event.target.previousElementSibling;
    var prevValue = amount.getAttribute('value') * 1;
    amount.setAttribute('value', prevValue + 1);
    amount.value = prevValue + 1;

    changePrices(event, prevValue, prevValue + 1);
  }
});

// 수량 직접 입력
selectedUl.addEventListener("change", function (event) {
  if (event.target.className == 'amount') {
    var prevValue = event.target.getAttribute('value') * 1;
    var newValue = event.target.value * 1;
    event.target.setAttribute('value', newValue);

    changePrices(event, prevValue, newValue);
  }
});