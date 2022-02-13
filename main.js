const pageSelect = document.querySelector('#framework')
const pageSelectBtn = document.querySelector('button#btn')
const columns = document.getElementsByClassName('table-header-item')

let HEROES = []
let AMOUNT_OF_ITEMS_DISPLAYED_ON_PAGE = 20
let PREVIOUS_AMOUNT_ON_PAGE = AMOUNT_OF_ITEMS_DISPLAYED_ON_PAGE

const ACCEPTABLE_FILTER_NAMES = ['name', 'weight']

let FILTER_CATEGORY = 'name'
let IS_FILTER_DESCENDING = true

const PAGE_NUMBER = 0

const getHeroes = () => {
  fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
    .then((response) => response.json())
    .then((h) => {
      HEROES = h
      displayHeroes()
    })
}

const sortHeroes = (a, b) => {
  switch (FILTER_CATEGORY) {
    case 'name':
      const nameA = IS_FILTER_DESCENDING ? a.name : b.name
      const nameB = IS_FILTER_DESCENDING ? b.name : a.name

      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    case 'weight':
      const weightA = IS_FILTER_DESCENDING ? parseInt(b.appearance.weight[1]) : parseInt(a.appearance.weight[1])
      const weightB = IS_FILTER_DESCENDING ? parseInt(a.appearance.weight[1]) : parseInt(b.appearance.weight[1])
      return weightA - weightB
  }
}

pageSelectBtn.addEventListener('click', () => {
  PREVIOUS_AMOUNT_ON_PAGE = AMOUNT_OF_ITEMS_DISPLAYED_ON_PAGE
  AMOUNT_OF_ITEMS_DISPLAYED_ON_PAGE = parseInt(pageSelect.value)

  displayHeroes()
})

for (let col of columns) {
  col.addEventListener('click', () => {
    const newFilterCategory = col.dataset.attrName

    if (FILTER_CATEGORY === newFilterCategory) {
      IS_FILTER_DESCENDING = !IS_FILTER_DESCENDING
    } else {
      if (ACCEPTABLE_FILTER_NAMES.includes(newFilterCategory)) {
        FILTER_CATEGORY = newFilterCategory
        IS_FILTER_DESCENDING = true
      }
    }

    displayHeroes()
  })
}

function displayHeroes() {
  const sortedHeroes = [...HEROES].sort(sortHeroes)

  const page = sortedHeroes.slice(PAGE_NUMBER * PREVIOUS_AMOUNT_ON_PAGE, AMOUNT_OF_ITEMS_DISPLAYED_ON_PAGE)

  const table = document.getElementById('myTable').tBodies

  // Remove everything but the first child in table
  while (table[0].childElementCount > 1) {
    table[0].removeChild(table[0].lastChild)
  }

  for (let index = 0; index < page.length; index++) {
    let row = table[0].insertRow(index + 1)

    let image = row.insertCell(0)
    let name = row.insertCell(1)
    let fullName = row.insertCell(2)
    let stats = row.insertCell(3)
    let race = row.insertCell(4)
    let gender = row.insertCell(5)
    let height = row.insertCell(6)
    let width = row.insertCell(7)
    let placeOfBirth = row.insertCell(8)
    let alignment = row.insertCell(9)

    image.innerHTML = `<img src=${page[index].images.sm}>`
    name.innerHTML = page[index].name
    fullName.innerHTML = page[index].biography.fullName

    for (const key in page[index].powerstats) {
      stats.innerHTML += ` <ul>
            <li>${key} ${page[index].powerstats[key]}  </li>
         </ul>  `
    }
    race.innerHTML = page[index].appearance.race
    gender.innerHTML = page[index].appearance.gender
    height.innerHTML = page[index].appearance.height[0] + '<br/>' + page[index].appearance.height[1]
    width.innerHTML = page[index].appearance.weight[1]
    placeOfBirth.innerHTML = page[index].biography.placeOfBirth
    alignment.innerHTML = page[index].biography.alignment
  }
}

getHeroes()
