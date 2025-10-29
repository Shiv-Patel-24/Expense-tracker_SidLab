import { useState, useEffect } from "react";
import { expenseAPI } from "../../utils/api";
import ExpenseForm from "../Expenses/ExpenseForm";
import ExpenseList from "../Expenses/ExpenseList";
import ExpenseFilter from "../Expenses/ExpenseFilter";
import StatsCard from "./StatsCard";
import ExpenseChart from "./ExpenseChart";
import Loader from "../Loader";
import { FaPlus, FaChartPie, FaList } from "react-icons/fa";
import "../../styles/dashboard.css";
import "../../styles/modal.css";
import "../../styles/buttons.css";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState("list");

  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, [filters]);

  const fetchExpenses = async () => {
    try {
      const { data } = await expenseAPI.getAll(filters);
      setExpenses(data.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await expenseAPI.getStats();
      setStats(data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await expenseAPI.delete(id);
        fetchExpenses();
        fetchStats();
      } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Failed to delete expense");
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingExpense) {
        await expenseAPI.update(editingExpense._id, formData);
      } else {
        await expenseAPI.create(formData);
      }
      setShowForm(false);
      setEditingExpense(null);
      fetchExpenses();
      fetchStats();
    } catch (error) {
      console.error("Error saving expense:", error);
      throw error;
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Expense Dashboard</h1>
        <button className="btn btn-secondary" onClick={handleAddExpense}>
          <FaPlus /> Add Expense
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <StatsCard
            title="Total Expenses"
            value={stats.totalExpenses}
            type="count"
          />
          <StatsCard
            title="Total Amount"
            value={stats.totalAmount}
            type="currency"
          />
          <StatsCard
            title="Categories"
            value={stats.categoryBreakdown.length}
            type="count"
          />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "list" ? "active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          <FaList /> Expense List
        </button>
        <button
          className={`tab-btn ${activeTab === "charts" ? "active" : ""}`}
          onClick={() => setActiveTab("charts")}
        >
          <FaChartPie /> Analytics
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {activeTab === "list" ? (
          <>
            <ExpenseFilter onFilterChange={handleFilterChange} />
            <ExpenseList
              expenses={expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </>
        ) : (
          <ExpenseChart stats={stats} expenses={expenses} />
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>
              ×
            </button>
            <ExpenseForm
              expense={editingExpense}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
