const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  // New message el
  const $newMessage = $messages.lastElementChild;

  // Height of the new msg
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  console.log('newMessageHeight', newMessageHeight);

  // Visible height
  const visibleHeight = $messages.offsetHeight;
  console.log('visibleHeight', visibleHeight);

  // Height of messages container
  const containerHeight = $messages.scrollHeight;
  console.log('containerHeight', containerHeight);

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;
  console.log('scrollOffset', scrollOffset);

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector('#sidebar').innerHTML = html;
});

socket.on('locationMessage', (message) => {
  console.log(message);
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messageForm.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements['message'].value;

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

    if (error) {
      console.log(error);
    }

    console.log('Message delivered!');
  });
});

$sendLocationButton.addEventListener('click', () => {
  console.log('HERE');
  if (!navigator.geolocation) {
    console.log('HERE 2');
    return alert('Geolocation is not supported by your browser');
  }

  $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position.coords.latitude);
      socket.emit(
        'sendLocation',
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        (err) => {
          if (err) {
            console.log(err);
          }

          $sendLocationButton.removeAttribute('disabled');
          console.log('Location shared!');
        }
      );
    },
    (err) => {
      console.log(err);
      $sendLocationButton.removeAttribute('disabled');
    },
    { timeout: 10000 }
  );
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
