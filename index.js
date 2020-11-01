const options = {};

let fruits = [
  {
    id: 1,
    title: 'Apples',
    price: 20,
    img:
      'https://wp02-media.cdn.ihealthspot.com/wp-content/uploads/sites/482/2018/10/17210524/apples.jpg',
  },
  {
    id: 2,
    title: 'Oranges',
    price: 30,
    img: 'https://s3.amazonaws.com/images.ecwid.com/images/9141101/1080244047.jpg',
  },
  {
    id: 3,
    title: 'Mango',
    price: 40,
    img: 'https://i.ebayimg.com/00/s/MTA1OVgxNjAw/z/3oYAAOSwe~ha-ax4/$_57.JPG?set_id=8800005007',
  },
];

const toHTML = (fruit) => `
  <div class="col">
    <div class="card">
      <img
        src="${fruit.img}"
        class="card-img-top"
        alt="${fruit.title}"
        style="height: 300px"
      />
      <div class="card-body">
        <h5 class="card-title">${fruit.title}</h5>
        <p class="card-text">
          <a href="#" class="btn btn-primary" data-btn="price" data-id="${fruit.id}">See price</a>
          <a href="#" class="btn btn-danger" data-btn="remove" data-id="${fruit.id}">Delete</a>
        </p>
      </div>
    </div>
  </div>
`;

function render() {
  const html = fruits.map(toHTML).join('');
  document.querySelector('.fruits').innerHTML = html;
}

render();

const modal = $.modal({
  title: 'Product Price',
  closable: true,
  width: 400,
  footerButtons: [
    {
      text: 'Close',
      type: 'secondary',
      handler() {
        modal.close();
      },
    },
  ],
});

document.addEventListener('click', (e) => {
  e.preventDefault();
  const btnType = e.target.dataset.btn;
  const id = +e.target.dataset.id;
  const fruit = fruits.find((el) => el.id === id);

  if (btnType === 'price') {
    modal.setContent(`
      <p>${fruit.title} Price is <strong>${fruit.price}$</strong></p>
    `);
    modal.open();
  } else if (btnType === 'remove') {
    $.confirm({
      title: 'Are you sure?',
      content: `<p>You definitely want to delete <strong>${fruit.title}</strong></p>`,
    })
      .then(() => {
        fruits = fruits.filter((f) => f.id !== id);
        render();
      })
      .catch(() => console.log('Cancel'));
  }
});
