import '../../styles/footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {currentYear} Expense Tracker. Built with MERN Stack by Shiv Patel</p>
      </div>
    </footer>
  )
}

export default Footer
