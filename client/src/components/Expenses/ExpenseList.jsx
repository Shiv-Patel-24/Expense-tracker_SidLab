import ExpenseItem from './ExpenseItem'
import { groupExpensesByDate, calculateTotal, formatCurrency } from '../../utils/helpers'
import '../../styles/expenselist.css'

const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>No expenses found. Start by adding your first expense!</p>
      </div>
    )
  }

  const groupedExpenses = groupExpensesByDate(expenses)
  const totalAmount = calculateTotal(expenses)

  return (
    <div className="expense-list">
      <div className="expense-list-header">
        <h2>Your Expenses</h2>
        <div className="expense-total">
          <span>Total: </span>
          <strong>{formatCurrency(totalAmount)}</strong>
        </div>
      </div>

      {Object.entries(groupedExpenses).map(([date, dateExpenses]) => (
        <div key={date} className="expense-date-group">
          <h3 className="expense-date">{date}</h3>
          <div className="expense-items">
            {dateExpenses.map((expense) => (
              <ExpenseItem
                key={expense._id}
                expense={expense}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ExpenseList
