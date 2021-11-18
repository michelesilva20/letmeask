import { Link, useHistory } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import { Button } from '../components/Button';
import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';

import { getDatabase, ref, push} from 'firebase/database'

// webpack
export function NewRoom(){
const { user } = useAuth()
const history = useHistory()
const [newRoom, setNewRoom] = useState('')

 async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }


    const db = getDatabase()
    const firebaseRoom = await push(ref(db, "rooms/"),{
            title: newRoom,
            authorId: user?.id
        })

    history.push(`/admin/rooms/${firebaseRoom.key}`)
 }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
       
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Crie uma nova sala</h2>
          <form  onSubmit={handleCreateRoom}>
              <input 
                  type="text" 
                  placeholder="Nome da sala"
                  onChange={event => setNewRoom(event.target.value)}
                  value={newRoom}
              />
              <Button type="submit">
                  Criar sala
              </Button>
          </form>
          <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
        </div>
      </main>
    </div>
  )
}