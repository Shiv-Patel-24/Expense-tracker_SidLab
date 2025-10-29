import { formatCurrency } from '../../utils/helpers'
import '../../styles/statscard.css'

const StatsCard = ({ title, value, type }) => {
  const formatValue = () => {
    if (type === 'currency') {
      return formatCurrency(value)
    }
    return value
  }

  return (
    <div className="stats-card">
      <h3 className="stats-title">{title}</h3>
      <p className="stats-value">{formatValue()}</p>
    </div>
  )
}

export default StatsCard
