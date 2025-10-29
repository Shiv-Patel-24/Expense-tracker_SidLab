import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { formatCurrency, getCategoryColor } from '../../utils/helpers'
import '../../styles/chart.css'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const ExpenseChart = ({ stats, expenses }) => {
  if (!stats) return null

  // Category Pie Chart Data
  const categoryData = {
    labels: stats.categoryBreakdown.map((cat) => cat._id),
    datasets: [
      {
        label: 'Amount Spent',
        data: stats.categoryBreakdown.map((cat) => cat.total),
        backgroundColor: stats.categoryBreakdown.map((cat) =>
          getCategoryColor(cat._id)
        ),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  }

  // Monthly Bar Chart Data
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthlyData = {
    labels: stats.monthlyBreakdown.map(
      (month) => `${monthNames[month._id.month - 1]} ${month._id.year}`
    ),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: stats.monthlyBreakdown.map((month) => month.total),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${formatCurrency(context.parsed || context.parsed.y)}`
          },
        },
      },
    },
  }

  return (
    <div className="chart-container">
      <div className="chart-section">
        <h2>Category Breakdown</h2>
        <div className="chart-wrapper pie-chart">
          <Pie data={categoryData} options={chartOptions} />
        </div>

        <div className="category-list">
          {stats.categoryBreakdown.map((cat) => (
            <div key={cat._id} className="category-item">
              <div
                className="category-color"
                style={{ backgroundColor: getCategoryColor(cat._id) }}
              />
              <span className="category-name">{cat._id}</span>
              <span className="category-amount">{formatCurrency(cat.total)}</span>
              <span className="category-count">({cat.count} expenses)</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-section">
        <h2>Monthly Trend (Last 6 Months)</h2>
        <div className="chart-wrapper bar-chart">
          <Bar data={monthlyData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default ExpenseChart
