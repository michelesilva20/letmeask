import { useHistory, useParams } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import { getDatabase, ref, push, onValue, remove, update} from 'firebase/database'
import '../styles/room.scss';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  //const {user} = useAuth();
  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions} = useRoom(roomId)

  async function handleEndRoom(){
    const db = getDatabase()
      await update(ref(db, `rooms/${roomId}`), {
        endedAt: new Date(),
      })

      history.push('/');
  }


  async function handleDeleteQuestion(questionId: string){
    if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
      const db = getDatabase()
      await remove(ref(db, `rooms/${roomId}/questions/${questionId}`))
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string){
    const db = getDatabase()
      await update(ref(db, `rooms/${roomId}/questions/${questionId}`),{
        isAnswered: true,
      })
  }

  async function handleHighlightQuestion(questionId: string){
    const db = getDatabase()
      await update(ref(db, `rooms/${roomId}/questions/${questionId}`),{
        isHighlighted: true,
      })
  }

  return(
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala: {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        

        <div className="question-list">
          {questions.map(question => {
            return(
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                
                {!question.isAnswered && (
                <>
                  <button
                    type='button'
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  >
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                  </button>
                
                  <button
                    type='button'
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Dar destaque a Pergunta" />
                  </button>
                </>
                )}

                <button
                  type='button'
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover Pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  );
}