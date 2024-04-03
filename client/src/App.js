import MessageWindow from './components/shared/MessageWindow/MessageWindow';
import { useQueryClient, useMutation } from 'react-query';
import RequestService from './services/RequestService';

function App() {
  const queryClient = useQueryClient();

  const mutation = useMutation(newMessage => RequestService.createMessage(newMessage), {
    onSuccess: () => queryClient.invalidateQueries(["messages"])
  });

  const onSubmit = (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const fields = Object.fromEntries(formData);

    mutation.mutate(fields);

    event.target.reset();
  }

  return (
    <div style={{width: '1200px', height: '500px', display: 'flex', flexDirection: 'column'}}>
      <MessageWindow />
      <div style={{marginTop: '10px', width: '100%', height: '60px', display: 'flex', flexDirection: 'column'}}>
        <form onSubmit={onSubmit}>
          <input style={{flex: '1'}} type='text' name='message' placeholder='Message' />
          <button type='submit' style={{flex: '1', cursor: 'pointer', marginTop: '5px'}}>Send</button>
        </form>
      </div>
    </div>
  )
}

export default App;
