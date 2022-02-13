const pageSelect = document.querySelector('#framework')
const pageSelectBtn = document.querySelector('button#btn')
const columnHeaderElements = document.getElementsByClassName('table-header-item')

const prevPageButton = document.querySelector('#btn-prev')
const nextPageButton = document.querySelector('#btn-next')

const searchInput = document.querySelector('#search-input')

const currentPageElement = document.querySelector('#current-page')

let HEROES = []
let AMOUNT_OF_ITEMS_DISPLAYED_ON_PAGE = 20

const ACCEPTABLE_FILTER_NAMES = ['name', 'weight']

let FILTER_CATEGORY = 'name'
let IS_FILTER_DESCENDING = true

let PAGE_NUMBER = 0

// Fetches all heroes and starts render function
const getHeroes = () => {
  fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
    .then((response) => response.json())
    .then((h) => {
      // Save heroes to global variable
      HEROES = h

      // Render the first page of heroes
      renderHeroes()
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

// How many items to display on page
pageSelectBtn.addEventListener('click', () => {
  const currentNumberOfItemsDisplayed = AMOUNT_OF_ITEMS_DISPLAYED_ON_PAGE
  const newNumberOfItemsDisplayed = pageSelect.value
  const currentPageNumber = PAGE_NUMBER
  const newPageNumber = Math.floor((currentPageNumber * currentNumberOfItemsDisplayed) / newNumberOfItemsDisplayed)

  PAGE_NUMBER = newPageNumber
  AMOUNT_OF_ITEMS_DISPLAYED_ON_PAGE = parseInt(pageSelect.value)

  renderHeroes()
})

// Navigation for pages
prevPageButton.addEventListener('click', () => {
  if (PAGE_NUMBER > 0) {
    PAGE_NUMBER = PAGE_NUMBER - 1
    renderHeroes()
  }
})

nextPageButton.addEventListener('click', () => {
  if (PAGE_NUMBER < Math.ceil(HEROES.length / AMOUNT_OF_ITEMS_DISPLAYED_ON_PAGE) - 1) {
    PAGE_NUMBER = PAGE_NUMBER + 1
    renderHeroes()
  }
})

// Header elements for sorting
for (let headerElement of columnHeaderElements) {
  headerElement.addEventListener('click', () => {
    const newFilterCategory = headerElement.dataset.attrName

    if (FILTER_CATEGORY === newFilterCategory) {
      IS_FILTER_DESCENDING = !IS_FILTER_DESCENDING
    } else {
      if (ACCEPTABLE_FILTER_NAMES.includes(newFilterCategory)) {
        FILTER_CATEGORY = newFilterCategory
        IS_FILTER_DESCENDING = true
      }
    }

    renderHeroes()
  })
}

// Search
searchInput.addEventListener('keyup', (event) => {
  const search = searchInput.value.toLowerCase()

  if (search === '') {
    renderHeroes()
  } else {
    const filteredHeroes = HEROES.filter((hero) => {
      return hero.name.toLowerCase().includes(search)
    })

    renderHeroes(filteredHeroes)
  }
})

function renderHeroes(passedHeroes = HEROES) {
  // Destructuring the heroes array so that HEROES would not be changed
  const sortedHeroes = [...passedHeroes].sort(sortHeroes)

  // Get current items for the page
  const startIndex = PAGE_NUMBER * AMOUNT_OF_ITEMS_DISPLAYED_ON_PAGE
  const endIndex = startIndex + AMOUNT_OF_ITEMS_DISPLAYED_ON_PAGE
  const page = sortedHeroes.slice(startIndex, endIndex)

  // Update page number in html
  currentPageElement.innerHTML = PAGE_NUMBER + 1

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

// Initialize everything
getHeroes()
