import { useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import './Styles.css';

function TextBox({ onSubmit }) {
  const textareaRef = useRef(null);
  const POVRef = useRef(null);
  const charRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = textareaRef.current?.value ?? '';
    if (text.trim() === '') {
      toast.error('Error: Text empty');
      return;
    }
    onSubmit?.({
      text,
      POV: POVRef.current?.value ?? '',
      chars: charRef.current?.value ?? '',
    });
  };

  const handleClear = () => {
    for (const ref of [textareaRef, POVRef, charRef]) {
      if (ref.current) ref.current.value = '';
    }
  };

  return (
    <div className="textbox">
      <ToastContainer position="top-right" autoClose={1000} />

      <form className="textbox-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="story-text">Text</label>
        <textarea
          id="story-text"
          ref={textareaRef}
          className="field field-main"
          placeholder="Paste your text here..."
          rows={12}
        />

        <div className="name-fields">
          <div className="name-field">
            <label className="field-label" htmlFor="pov-names">POV characters</label>
            <textarea
              id="pov-names"
              ref={POVRef}
              className="field"
              placeholder="Comma separated. If your work is in 1st person, put 'I'..."
              rows={3}
            />
          </div>

          <div className="name-field">
            <label className="field-label" htmlFor="char-names">Other characters</label>
            <textarea
              id="char-names"
              ref={charRef}
              className="field"
              placeholder="Comma separated..."
              rows={3}
            />
          </div>
        </div>

        <div className="button-row">
          <button type="submit" className="btn btn-primary">Calculate!</button>
          <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
        </div>
      </form>
    </div>
  );
}

export default TextBox;
