import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Button = ({ text, handleClick }) => <button onClick={handleClick}>{text}</button>

const Statistic = ({ name, value }) => (
  <tr>
    <td>{name}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const count = good + neutral + bad;
  const avg = (good - bad) / count;

  if (count === 0) {
    return <p>No feedback given</p>
  }

  return (
    <React.Fragment>
      <h2>statistics</h2>
      <table>
        <tbody>
          <Statistic name='good' value={good} />
          <Statistic name='neutral' value={neutral} />
          <Statistic name='bad' value={bad} />
          <Statistic name='all' value={count} />
          <Statistic name='average' value={avg} />
          <Statistic name='positive' value={`${good / count * 100} %`} />
        </tbody>
      </table>
    </React.Fragment>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>give feedback</h2>
      <Button text='good' handleClick={() => setGood(good + 1)} />
      <Button text='neutral' handleClick={() => setNeutral(neutral + 1)} />
      <Button text='bad' handleClick={() => setBad(bad + 1)} />
      <Statistics {...{ good, neutral, bad }} />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
