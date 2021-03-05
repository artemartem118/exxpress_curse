const toCurrency = (number) => {
  return new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
  }).format(number)
}

const toDate = date => new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}).format(new Date(date))

document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent)
})

document.querySelectorAll('.date').forEach(node => {
  node.textContent = toDate(node.textContent)
})


const cardElement = document.querySelector('#card')
if (cardElement) {
  cardElement.addEventListener('click', (e) => {
    const { target } = e
    if (target.classList.contains('js-remove')) {
      const { id, csrf } = target.dataset
      fetch(`/card/remove/${id}`, {
        method: 'DELETE',
        headers: {
          'X-XSRF-TOKEN': csrf
        }
      }).then(res => res.json())
        .then(card => {
          if (card.courses.length) {
            const html = card.courses.map(c => {
              return `
                <tr>
                  <td>${c.title}</td>
                  <td>${c.count}</td>
                  <td>
                    <button class="btn btn-small js-remove" data-id="${c._id}">Удалить</button>
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


M.Tabs.init(document.querySelectorAll('.tabs'))
