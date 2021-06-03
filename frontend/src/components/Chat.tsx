import React, { useState,useEffect,useRef } from "react";
import Socket from './Socket';
import Picker, { SKIN_TONE_MEDIUM_LIGHT } from 'emoji-picker-react';
import '../App.css';

const Chat = ({name}:any) => {

    const [names, setNames] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([] as any);

    const onEmojiClick = (event:any, emojiObject:any) => {
        setMessage(`${message} ${emojiObject.emoji}`);
    };

    useEffect(() => {

        Socket.on('messages', message => {
            setMessages([...messages, message]);
        });

        return () => {
            Socket.off();
        }

    }, [messages]);

    useEffect(() => {

        Socket.on('users', (people) => {
            setNames(people);
        });

    });

    const divRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => {
        divRef.current?.scrollIntoView({behavior: 'smooth'});
    });

    const submit = (e:any) => {
        e.preventDefault();
        if(message !== ''){
            Socket.emit('message', name, message);
            setMessage('');
        }
    }

    const sendMessage = (e:any) => {
        if(e.keyCode === 13) {
            submit(e);
        }
    }

    return (
        <div className="container content">
            <div className="row justify-content-center">
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <div className="card shadow">
                        <div className="card-header">People</div>
                        <div className="card-body height3">
                            <div className="text-start">
                                <ul className="list-unstyled">
                                    {names.map((e:any, i:any) =>
                                        <li key={i}>
                                           <div><i className="fas fa-arrow-right"></i><span className="fw-bold"> {e}</span></div>
                                            <i className="fa fa-circle online"></i> <span className="fw-light"> online</span>
                                            <hr/>
                                        </li>
                                    )}
                                </ul>
                                <div className="text-center text-capitalize">
                                    <span className="fw-bold">{name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12">
                    <div className="card shadow">
                        <div className="card-header">Chat</div>
                        <div className="card-body height3">
                            <ul className="chat-list">
                                {messages.map((e:any, i:any) =>
                                    <li className={ e.name == name ? 'out' : 'in' } key={i}>
                                        <div className="chat-body">
                                            <div className="chat-message">
                                                <div className="text-center">
                                                    <h5>{e.name}</h5>
                                                </div>
                                                <p>{e.message}</p>
                                            </div>
                                        </div>
                                    </li>
                                )}
                                <div ref={divRef}></div>
                            </ul>
                            <hr/>
                            <form onSubmit={submit} className="row">
                                <div className="col-9">
                                    <textarea value={message} onKeyDown={sendMessage} id="textMessage" rows={1} cols={1} className={"form-control"} onChange={e => setMessage(e.target.value)}></textarea>
                                </div>
                                <div className="col-3">
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="dropdown">
                                                <button className="btn btn-outline-dark btn-small" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i className="far fa-smile-beam"></i></button>
                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                    <Picker onEmojiClick={onEmojiClick} skinTone={ SKIN_TONE_MEDIUM_LIGHT } groupVisibility={{recently_used: false}}/>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <button className="btn btn-dark"><i className="far fa-paper-plane"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;