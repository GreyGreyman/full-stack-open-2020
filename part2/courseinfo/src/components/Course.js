import React from 'react'

const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Content = ({ parts }) =>
  parts.map(part =>
    <Part key={part.id} {...part} />
  )

const Total = ({ parts }) => {
  const sum = parts.reduce((a, b) => a + b.exercises, 0)
  return `total of ${sum} exercises`
};

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course