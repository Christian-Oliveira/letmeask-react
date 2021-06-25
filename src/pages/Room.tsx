import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuthContext } from '../hooks/useAuthContext';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import '../styles/room.scss';

type RoomParams = {
    id: string;
}

export function Room() {
    const [newQuestion, setNewQuestion] = useState('');
    const {user} = useAuthContext();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const {title, questions} = useRoom(roomId);

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            toast.error("Digite uma pergunta!");
            return;
        }

        if (!user) {
            toast.error("Você não está logado.")
        }

        const question = {
            content: newQuestion,
            author: {
                name: user?.name,
                avatar: user?.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);

        setNewQuestion('');
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Logo do Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="O que você quer perguntar?" 
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                        autoFocus
                    />
                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button></span>
                        )}
                        <Button type="submit">Enviar pergunta</Button>
                    </div>
                </form>

                <div className="question-list">
                    {questions.map(question => {
                        return <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                        />
                    })}
                </div>
            </main>
        </div>
    );
}