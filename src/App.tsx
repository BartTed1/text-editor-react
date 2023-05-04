import React from 'react';
import './App.css';
import TextEdit, {FileTypes} from './components/TextEdit/TextEdit';

function App() {
  return (
    <div className="App">
        <div className="ResInfo">{window.innerWidth}x{window.innerHeight}</div>
      <TextEdit maxLength={100} maxFileSize={10240} allowedFileTypes={[FileTypes.IMAGE, FileTypes.VIDEO, FileTypes.PDF]} maxAllowedFiles={4}></TextEdit>
    </div>
  );
}

export default App;
