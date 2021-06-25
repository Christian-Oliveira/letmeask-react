import toast from 'react-hot-toast';
import copyImage from '../assets/images/copy.svg';
import '../styles/room-code.scss';

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCode() {
        navigator.clipboard.writeText(props.code);
        toast.success('Código copiado com sucesso!')
    }

    return(
        <button className="room-code" onClick={copyRoomCode}>
            <div>
                <img src={copyImage} alt="Copiar código da sala" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    );
}