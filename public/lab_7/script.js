function convertRestaurantsToCategories(restaurantList) {
  
  const categories = restaurantList.reduce((cat_list, restaurant) => {
    const checkCat = cat_list.find((cat) => cat.label === restaurant.category);
    if (!checkCat) {
      cat_list.push({y: 1, label: restaurant.category});
    } else {
      checkCat.y +=1;
    }
    return checkCat;
    return cat_list;
  }, []);
  console.log(categories);
  return categories;
}

function makeYourOptionsObject(datapointsFromRestaurantsList) {
  // set your chart configuration here!
  CanvasJS.addColorSet('customColorSet1', ['#F4FA0D', '#186ED6', '#E326ED', '#00DE19', '#EB201C', '#702319', '#255BFS', '#20F03C', '#EB23AE', '#4C6275', '#F00000']);

  return {
    animationEnabled: true,
    colorSet: 'customColorSet1',
    title: {
      text: 'Places To Eat Out In Future'
    },
    axisX: {
      interval: 10,
      labelFontSize: 12
    },
    axisY2:{
      interlacedColor: 'rgba(1,77,101,.2)',
      gridColor: 'rgba(1,77,101,.1)',
      title: 'Restaurants By Category',
      labelFontSize: 12,
      scaleBreaks:{
        color: 'gray',
        type: 'wavy', 
        customBreaks: [
          {color: 'gray',startValue: 40, endValue: 50}, 
          {color: 'gray', startValue: 85, endValue: 100}, 
          {color: 'gray',startValue: 140, endValue: 175}
        ] 
      }
    },
    data: [{
      type: 'bar',
      name: 'restaurants',
      axisYType: 'secondary',
      dataPoints: datapointsFromRestaurantsList
    }]
  };
}

function runThisWithResultsFromServer(jsonFromServer) {
  console.log('jsonFromServer', jsonFromServer);
  sessionStorage.setItem('restaurantList', JSON.stringify(jsonFromServer)); // don't mess with this, we need it to provide unit testing support

  // Process your restaurants list
  // Make a configuration object for your chart
  // Instantiate your chart
  const reorganizedData = convertRestaurantsToCategories(jsonFromServer);
  const options = makeYourOptionsObject(reorganizedData);
  const chart = new CanvasJS.Chart('chartContainer', options);
  chart.render();
}

/// Leave lines 52-67 alone; do your work in the functions above
document.body.addEventListener('submit', async (e) => {
  e.preventDefault(); // this stops whatever the browser wanted to do itself.
  const form = $(e.target).serializeArray();
  fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form)
  })
    .then((fromServer) => fromServer.json())
    .then((jsonFromServer) => runThisWithResultsFromServer(jsonFromServer))
    .catch((err) => {
      console.log(err);
    });
});