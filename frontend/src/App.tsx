import React, {useState} from 'react';
import Socket from './components/Socket';
import Chat from "./components/Chat";
import  './worker';
import {chatOpen} from './Anime';
import './Parallax';
import './App.css';


function App() {

    function urlBase64ToUint8Array(base64String:any) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    const PUBLIC_VAPID_KEY = 'BDISNplTWuzM5ePlOv5HeY5UejZ5vvwrX55SiPBmiAKzShyjSdInEFG8cwvyk8eDHwAdTa7GMG-jR2RTTCQraVQ';

    const subscription = async () => {

        //service worker
        const register =
            await navigator.serviceWorker.register('./worker.js')
                .then(function(registration) {
                    return registration;
                })
                .catch(function(err) {
                    console.error('Unable to register service worker.', err);
                });
        //const register = await navigator.serviceWorker.register('./worker.js');

        const askPermission =
            new Promise(function(resolve, reject) {
                const permissionResult = Notification.requestPermission(function(result) {
                    resolve(result);
                });

                if (permissionResult) {
                    permissionResult.then(resolve, reject);
                }
            })
                .then(function(permissionResult) {
                    if (permissionResult !== 'granted') {
                        throw new Error('We werent granted permission.');
                    }
                });

        const subscription =
            await navigator.serviceWorker.register('/worker.js')
                .then(function(registration) {
                    const subscribeOptions = {
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
                    };

                    return registration.pushManager.subscribe(subscribeOptions);
                })
                .then(function(pushSubscription) {
                    return pushSubscription;
                });

        // const subscription = await register.pushManager.subscribe({
        //     userVisibleOnly: true,
        //     applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        // });

        let url = `${window.location.protocol}//${window.location.hostname}:3000/subscription`;
        await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(subscription),
        });
    }

    subscription();

  const [name, setName] = useState('');
  const [registered, setRegistered] = useState(false);

  const register = async (e:any) => {
      e.preventDefault();
      if(name !== '') {

          let url = `${window.location.protocol}//${window.location.hostname}:3000/join`;
          await fetch(url,{
              method: 'POST',
              body: JSON.stringify({
                  name: name
              }),
              headers: {
                  "Content-Type": "application/json"
              }
          });
          setRegistered(true);
          Socket.emit('connected', name);
          chatOpen();
      }else{
          setRegistered(false);
      }
  }

  return (
    <div className="App">
        {
            !registered &&
            <div className="container content form-name">
                <div className="row h-100 justify-content-center">
                    <div className="col-lg-6 col-12 my-auto">
                        <div className="card card-block shadow">
                            <div className="card-header text-center">Chat | SantiMilos</div>
                            <div className="card-body">
                                <form onSubmit={register}>
                                    <input className="form-control" placeholder="Name" type="text" value={name} onChange={e => setName(e.target.value)}/>
                                    <small className="text-muted fst-italic pt-2">Please enter a name to identify yourself in the chat room</small>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
        {
            registered &&

            <Chat name={name} />
        }
    </div>
  );
}

export default App;
