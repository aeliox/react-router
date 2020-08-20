import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
  useAction
} from 'react-router';

describe('useAction', () => {
  let node;
  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node);
  });

  afterEach(() => {
    document.body.removeChild(node);
    node = null;
  });

  const click = () => {
    let button = node.querySelector('button');
    expect(button).not.toBeNull();

    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  };

  it('returns the action when navigating', () => {
    function Home() {
      let navigate = useNavigate();
      let action = useAction();

      return (
        <div>
          <h1>Home: {action}</h1>
          <button onClick={() => navigate('../about')}>about</button>
        </div>
      );
    }

    function About() {
      let action = useAction();
      let navigate = useNavigate();
      return <button onClick={() => navigate(-1)}>About: {action}</button>;
    }

    act(() => {
      ReactDOM.render(
        <Router initialEntries={['/home']}>
          <Routes>
            <Route path="home" element={<Home />} />
            <Route path="about" element={<About />} />
          </Routes>
        </Router>,
        node
      );
    });

    expect(node.innerHTML).toMatchInlineSnapshot(
      `"<div><h1>Home: POP</h1><button>about</button></div>"`
    );

    // Go forward
    click();

    expect(node.innerHTML).toMatchInlineSnapshot(
      `"<button>About: PUSH</button>"`
    );

    // Go back
    click();

    expect(node.innerHTML).toMatchInlineSnapshot(
      `"<div><h1>Home: POP</h1><button>about</button></div>"`
    );
  });
});
