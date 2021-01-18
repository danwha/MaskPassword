var ruleIndex = 0
var ruleSequence = []

refreshTime = () =>{
  let d = new Date()
  let utcYear = d.getUTCFullYear()
  let utcYearShort = utcYear.toString().substr(2,2)
  var utcMonth = d.getUTCMonth() + 1
  utcMonth = (utcMonth < 10) ? `0${utcMonth}` : utcMonth
  let utcMonthName = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][d.getUTCMonth()]
  let utcWeekName = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getUTCDay()]
  var utcDate = d.getUTCDate()
  utcDate = (utcDate < 10) ? `0${utcDate}` : utcDate
  var utcHour = d.getUTCHours()
  utcHour = (utcHour < 10) ? `0${utcHour}` : utcHour

  $('#currentUTC').text(d.toJSON().substr(0,19) +' / '+ d.toUTCString())
  $('#currentLocal').text(d.toLocaleString())

  $('#fYear').text(utcYear);      $('#fYear').attr('data-value', utcYear)
  $('#sYear').text(utcYearShort); $('#sYear').attr('data-value', utcYearShort)
  $('#lMonth').text(utcMonthName);$('#lMonth').attr('data-value', utcMonthName)
  $('#sMonth').text(utcMonth);    $('#sMonth').attr('data-value', utcMonth)
  $('#weekday').text(utcWeekName);$('#weekday').attr('data-value', utcWeekName)
  $('#date').text(utcDate);       $('#date').attr('data-value', utcDate)
  $('#lHour').text(utcHour);      $('#lHour').attr('data-value', utcHour)

  var ruleString = []
  ruleSequence.some(item => {
    switch(item.type){
      case 'Y': ruleString.push(utcYear);       break
      case 'y': ruleString.push(utcYearShort);  break
      case 'M': ruleString.push(utcMonthName);  break
      case 'm': ruleString.push(utcMonth);      break
      case 'w': ruleString.push(utcWeekName);   break
      case 'd': ruleString.push(utcDate);       break
      case 'h': ruleString.push(utcHour);       break
      case 's': ruleString.push(item.value);    break
    } // switch
  }) // some
  $('#rules').text(ruleString.join(''))

  // with db guestRule
  if(guestRule != ''){
    ruleString = []
    JSON.parse(guestRule).some(item => {
      switch(item.type){
        case 'Y': ruleString.push(utcYear);       break
        case 'y': ruleString.push(utcYearShort);  break
        case 'M': ruleString.push(utcMonthName);  break
        case 'm': ruleString.push(utcMonth);      break
        case 'w': ruleString.push(utcWeekName);   break
        case 'd': ruleString.push(utcDate);       break
        case 'h': ruleString.push(utcHour);       break
        case 's': ruleString.push(item.format);   break
      } // switch
    }) // some
    $('#labelRule').text(ruleString.join(''))
  }
}

let scheduler = setInterval(
  refreshTime,
  1000 * 1 // 10 secs
)

removeRule = id => {
  //$(object).parent().remove();
  $(`#${id}`).remove();
  for(var i = 0; i < ruleSequence.length; i++){
    if(ruleSequence[i].id == id){ruleSequence.splice(i,1)}
  }
  refreshTime();
}
clearChars = input => {
  $(input).val('')
}
checkChars = input => {
  let inputText = $(input).val().trim()
  if(inputText == '') return

  const regExp = /^[A-Za-z0-9-!:^_'?,.=\s+]{1,100}$/
  if(! regExp.test(inputText)){
    $(input).css('backgroundColor', 'red')
    $(input).css('color', 'white')
  }else{
    $(input).css('backgroundColor', '')
    $(input).css('color', '')
  }
} // checkChars

refreshTime()

document.addEventListener('DOMContentLoaded', event => {
  function handleDragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';
    itemsDrag.forEach(item => {item.classList.remove('over');});
    itemsDrop.forEach(item => {item.classList.remove('over');});
  }

  function handleDragOver(e) {
    if (e.preventDefault) {e.preventDefault();}
    return false;
  }

  function handleDragEnter(e) {this.classList.add('over');}
  function handleDragLeave(e) {this.classList.remove('over');}

  function handleDrop(e) {
    let ruleType = dragSrcEl.getAttribute('data-type')
    var ruleValue = dragSrcEl.getAttribute('data-value')
    e.stopPropagation();
    //this.innerHTML = e.dataTransfer.getData('text/html');

    if(ruleType == 's'){
      let input = dragSrcEl.getElementsByTagName('INPUT')
      let inputText = $(input).val().trim()

      if(inputText == '') return;
      ruleValue = inputText
    }

    ruleIndex++
    ruleSequence.push(
      {
        id    : `rule${ruleIndex}`,
        type  : ruleType,
        value : ruleValue
      }
    )
    refreshTime()

    var removeButton = document.createElement('button');
    removeButton.setAttribute('class', 'removeRule');
    removeButton.setAttribute('onclick', `removeRule('rule${ruleIndex}');`)
    removeButton.innerText = '✘'

    var newRule = document.createElement('label');
    newRule.setAttribute('id', `rule${ruleIndex}`);
    newRule.setAttribute('class', 'ruleBox');
    //newRule.innerHTML = e.dataTransfer.getData('text/html');
    newRule.innerText = ruleValue
    newRule.appendChild(removeButton);
    this.appendChild(newRule);

    return false;
  }

  let itemsDrag = document.querySelectorAll('.container .boxSrc');
  itemsDrag.forEach(item => {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragend', handleDragEnd, false);
  });

  let itemsDrop = document.querySelectorAll('#containerDrop');
  itemsDrop.forEach(item => {
    item.addEventListener('dragend', handleDragEnd, false);
    item.addEventListener('drop', handleDrop, false);
    item.addEventListener('dragover', handleDragOver, false);
    item.addEventListener('dragenter', handleDragEnter, false);
    item.addEventListener('dragleave', handleDragLeave, false);
  });
});

function dialogRule(yesCallback, noCallback) {
  var dialog = $('#modalRule')
    .dialog({
      dialogClass: "alert",
      height: "auto",
      width: 640,
      modal: true,
      //title:title,
      //autoOpen:false,
      closeOnEscape: false,
      show: {
        effect: "highlight",
        duration: 300
      },
      hide: {
        effect: "fade",
        duration: 300
      }
    })

  $('#ruleYes').off('click');
  $('#ruleNo').off('click');

  $('#ruleYes').on(
    'click',
    ()=>{
      dialog.dialog('close');
      yesCallback(ruleSequence);
    }
  );
  $('#ruleNo').on(
    'click',
    ()=>{
      dialog.dialog('close');
      noCallback();
    }
  );
} // dialogModal

createRule = (cleanOPen=true) => {
  if(cleanOPen){
    ruleIndex = 0
    ruleSequence = []
    $('#rules').text('')
    $('#containerDrop').find('.ruleBox').remove();
  }

  dialogRule(
    result =>{
      if(result.length) registRule(result)
    },
    () => {

    }
  )
} // createRule
registRule = rule => {
  let options = {
    url: '/registRule',
    type: 'POST',
    data: {
      rule    : rule
    },
    success: function (results) {
      console.log(results)
      let result = results.result;
      if (result == false) {
        retryRule(results.error)
        return;
      }

      guestRule = results.json
    },
    error: function (results) {
      console.log(results);
      retryRule(results)
    }
  };
  $.ajax(options);
} // registRule

retryRule = message => {
  var dialog = $('#modal_pop')
    .dialog({
      dialogClass: "alert",
      height: "auto",
      width: 400,
      modal: true,
      title: 'Rule creation',
      //autoOpen:false,
      closeOnEscape: false,
      show: {
        effect: "highlight",
        duration: 300
      },
      hide: {
        effect: "fade",
        duration: 300
      }
    })
  
  $('#modal_message').text(message)
  $('#btnOk').off('click')
  $('#btnOk').on('click',()=>{
    dialog.dialog('close')
    createRule(false)
  })
}
