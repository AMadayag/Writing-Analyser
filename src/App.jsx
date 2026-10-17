import { useState, useRef, useEffect } from 'react';
import TextBox from './TextBox'
import Stats from './Stats';
import { processTextCount } from './stats/ProcessText';
import './Styles.css'

function App() {
  const [statsObj, setStatsObj] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [statsObj]);

  function processText(data) {
    setStatsObj(processTextCount(data));
  }

  return (
    <div classname="cont">
      <h2>Writing Analyser</h2>
      <TextBox onSubmit={processText} />
      {statsObj && <Stats {...statsObj} />}
      <div ref={bottomRef} />
    </div>
  )
}

export default App
