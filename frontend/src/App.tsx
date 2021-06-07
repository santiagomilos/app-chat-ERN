import React, {useState} from 'react';
import Socket from './components/Socket';
import Chat from "./components/Chat";
import  './worker';
import {chatOpen} from './Anime';
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
        const register = await navigator.serviceWorker.register('./worker.js');
        
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        });

        let url = `${window.location.protocol}//${window.location.hostname}:3000/subscription`;
       await fetch(url, {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                "Content-Type": "application/json"
            }
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
                    <div className="col-6 my-auto">
                        <div className="card card-block shadow">
                            <div className="card-body">
                                <form onSubmit={register}>
                                    <label className="form-label">Name</label>
                                    <input className="form-control " type="text" value={name} onChange={e => setName(e.target.value)}/>
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
