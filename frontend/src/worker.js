window.self.addEventListener('push', e => {
    const data = e.data.json();
    window.self.register.showNotification(data.title, {
        body: data.message,
        icon: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Message_%28Send%29.png'
    }).then(r => console.log(r));
});