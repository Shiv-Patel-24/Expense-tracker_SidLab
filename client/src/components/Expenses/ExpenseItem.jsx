import { FaEdit, FaTrash } from 'react-icons/fa'
import { formatCurrency, getCategoryColor } from '../../utils/helpers'
import '../../styles/expenseitem.css'

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  return (
    <div className="expense-item">
      <div
        className="expense-category-indicator"
        style={{ backgroundColor: getCategoryColor(expense.category) }}
      />
      
      <div className="expense-details">
        <h4 className="expense-title">{expense.title}</h4>
        {expense.description && (
          <p className="expense-description">{expense.description}</p>
        )}
        <span className="expense-category-badge">{expense.category}</span>
      </div>

      <div className="expense-amount">
        {formatCurrency(expense.amount)}
      </div>

      <div className="expense-actions">
        <button
          className="btn btn-icon btn-edit"
          onClick={() => onEdit(expense)}
          title="Edit expense"
        >
          <FaEdit />
        </button>
        <button
          className="btn btn-icon btn-delete"
          onClick={() => onDelete(expense._id)}
          title="Delete expense"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  )
}

export default ExpenseItem
