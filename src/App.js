import React, { useState, useEffect } from 'react';
import uuid from 'uuid/dist/v4';
import './App.css';
import Alert from './components/Alert';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

const initialExpenses = localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : [];

function App() {
  // state values
  // all expenses
  const [expenses, setExpenses] = useState(initialExpenses);
  // single functions
  const [charge, setCharge] = useState('');
  // single amount
  const [amount, setAmount] = useState('');
  // alert
  const [alert, setAlert] = useState({ show: false });
  // edit
  const [edit, setEdit] = useState(false);
  // edit item
  const [id, setId] = useState(0);

  // useEffect
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  },[expenses])

  // functionalities
  const handleCharge = e => {
    setCharge(e.target.value);
  };
  const handleAmount = e => {
    setAmount(e.target.value);
  };

  // handle alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false })
    }, 3000)
  }

  const handleSubmit = e => {
    e.preventDefault();
    // console.log(charge, amount);
    if (charge !== '' && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map(item => {
          return item.id === id ? { ...item, charge, amount } : item
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: 'success', text: 'Item-Edited' })
      } else {
        const singleExpense = { id: uuid(), charge, amount }
        setExpenses([...expenses, singleExpense])
        handleAlert({ type: 'success', text: 'Item-Added' })
      }
      setCharge('');
      setAmount('');
    } else {
      // handle alert calls
      handleAlert({ type: 'danger', text: 'Enter valid details' })
    }
  };
  // clear items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({ type: 'danger', text: 'All Items Deleted' });
  }

  // delete
  const handleDelete = (id) => {
    let temp = expenses.filter(item => item.id !== id);
    setExpenses(temp);
    handleAlert({ type: 'danger', text: 'Item Deleted' });
  }

  // edit
  const handleEdit = (id) => {
    let expense = expenses.find(item => item.id === id);
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  }

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <h1>Budget Calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        Toatl Expenditure: <span className="total">
          &#8377; {expenses.reduce((acc, curr) => {
        return (acc += parseInt(curr.amount));
      }, 0)}
        </span>
      </h1>
    </>

  );
}

export default App;
