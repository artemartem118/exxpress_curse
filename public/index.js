const toCurrency = (number) => {
  return new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
  }).format(number)
}

document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent)
})


const cardElement = document.querySelector('#card')
if (cardElement) {
  cardElement.addEventListener('click', (e) => {
    const { target } = e
    if (target.classList.contains('js-remove')) {
      const { id } = target.dataset
      fetch(`/card/remove/${id}`, {
        method: 'DELETE'
      }).then(res => res.json())
        .then(card => {
          if (card.courses.length) {
            const html = card.courses.map(c => {
              return `
                <tr>
                  <td>${c.title}</td>
                  <td>${c.count}</td>
                  <td>
                    <button class="btn btn-small js-remove" data-id="${c.id}">Удалить</button>
                  </td>
                </tr>
             `
            }).join('')
            cardElement.querySelector('tbody').innerHTML = html
            cardElement.querySelector('.price').innerHTML = toCurrency(card.price)

          } else {
            cardElement.innerHTML = '<p>Корзина пуста</p>'
          }
        })
    }
  })
}
