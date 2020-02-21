//モーダルの回る時間
setInterval(activatePull,1000);

//プルホックの挙動開始
function activatePull(){ 

  var pullHook = document.getElementById('pull-hook');
           
  pullHook.addEventListener('changestate', function(event) {
  var message = ''; 

  switch (event.state) {
    case 'initial':
      message = '<ons-icon size="35px" icon="ion-arrow-down-a"></ons-icon> Pull to refresh';
      break;
    case 'preaction':
      message = '<ons-icon size="35px" icon="ion-arrow-up-a"></ons-icon> Release';
      break;
    case 'action':
      message = '<ons-icon size="35px" spin="true" icon="ion-load-d"></ons-icon> Loading...';
      break;
  }      
  pullHook.innerHTML = message;

  pullHook.onAction = function(done){
        flag = 1;
        getChat(done);
    }
  });
}

