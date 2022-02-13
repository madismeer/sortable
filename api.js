


const loadData = heroes => {
  //console.log(heroes[0].appearance) // write your code using the data in a function
  // note that you can not access heroes before this function is called.


  createStyleTag()
  displayHeroes(heroes)

}



// Request the file fetch, it will download it in your browser cache
fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
  .then((response) => response.json()) // parse the response from JSON
  .then(loadData) // .then will call the function with the JSON value








function createStyleTag() {
  let css = 'table, td { border: 1px solid black; }'
  let head = document.head || document.getElementsByTagName('head')[0];
  let style = document.createElement('style');
  head.appendChild(style);
  style.appendChild(document.createTextNode(css));
}


function displayHeroes(heroes) {

  const getTable = document.getElementById("myTable").tBodies

  for (let index = 0; index < heroes.length; index++) {


    let row = getTable[0].insertRow(index + 1)

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



    image.innerHTML = `<img src=${heroes[index].images.sm}>`
    name.innerHTML = heroes[index].name
    fullName.innerHTML = heroes[index].biography.fullName

    for (const key in heroes[index].powerstats) {

      stats.innerHTML +=
        ` <ul>
            <li>${key} ${heroes[index].powerstats[key]}  </li>
         </ul>  `
    }
    race.innerHTML = heroes[index].appearance.race
    gender.innerHTML = heroes[index].appearance.gender
    height.innerHTML = heroes[index].appearance.height[0] + "<br/>" + heroes[index].appearance.height[1]
    width.innerHTML = heroes[index].appearance.weight[0] + "<br/>" + heroes[index].appearance.weight[1]
    placeOfBirth.innerHTML = heroes[index].biography.placeOfBirth
    alignment.innerHTML = heroes[index].biography.alignment


  }


}


